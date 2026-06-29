#!/usr/bin/env node

import { cp, lstat, mkdir, readdir, readFile, rm, symlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = path.join(rootDir, "skills");
const defaultTarget = path.join(process.env.HOME ?? "~", ".codex", "skills");

function usage() {
  console.log(`用法：
  mts search <query>
  mts validate
  mts install <name> [--target <目录>] [--link] [--force]
  mts update <name> [--target <目录>] [--link] [--force]
  mts uninstall <name> [--target <目录>]

选项：
  --target <目录>  安装目录，默认：${defaultTarget}
  --link           安装或更新时创建软链接而不是复制文件
  --force          替换已存在的同名安装
  -h, --help       显示帮助
`);
}

function fail(message) {
  console.error(`错误：${message}`);
  process.exitCode = 1;
}

function parseOptions(args) {
  const options = { target: defaultTarget, link: false, force: false };
  const positional = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--target") {
      const target = args[index + 1];
      if (!target) throw new Error("--target 需要一个目录参数");
      options.target = path.resolve(target);
      index += 1;
    } else if (arg === "--link") {
      options.link = true;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg.startsWith("-")) {
      throw new Error(`未知选项：${arg}`);
    } else {
      positional.push(arg);
    }
  }

  return { options, positional };
}

async function readSkill(name) {
  const directory = path.join(skillsDir, name);
  let metadata;
  try {
    metadata = JSON.parse(await readFile(path.join(directory, "skill.json"), "utf8"));
  } catch {
    return null;
  }
  return { directory, metadata };
}

async function listSkills() {
  const entries = await readdir(skillsDir, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "_template") continue;
    const skill = await readSkill(entry.name);
    if (skill) skills.push({ name: entry.name, ...skill });
  }
  return skills.sort((left, right) => left.name.localeCompare(right.name));
}

function validateMetadata(name, metadata) {
  const errors = [];
  if (metadata.name !== name) errors.push("name 必须与目录名一致");
  if (metadata.path !== `skills/${name}`) errors.push(`path 必须为 skills/${name}`);
  if (typeof metadata.displayName !== "string" || !metadata.displayName) errors.push("displayName 必须为非空字符串");
  if (typeof metadata.description !== "string" || !metadata.description) errors.push("description 必须为非空字符串");
  if (!/^\d+\.\d+\.\d+$/.test(metadata.version ?? "")) errors.push("version 必须为 major.minor.patch");
  if (!["skill", "mcp", "plugin"].includes(metadata.type)) errors.push("type 必须为 skill、mcp 或 plugin");
  for (const field of ["tags", "scenarios"]) {
    if (!Array.isArray(metadata[field]) || metadata[field].length === 0) errors.push(`${field} 必须为非空数组`);
  }
  if (metadata.entry !== "SKILL.md") errors.push("entry 必须为 SKILL.md");
  return errors;
}

async function exists(target) {
  try {
    await lstat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function install(name, options, { updating = false } = {}) {
  const skill = await readSkill(name);
  if (!skill || name === "_template") throw new Error(`未找到技能：${name}`);

  const errors = validateMetadata(name, skill.metadata);
  if (errors.length > 0) throw new Error(`技能元数据无效：${errors.join("；")}`);

  const destination = path.join(options.target, name);
  const destinationExists = await exists(destination);
  if (destinationExists && !options.force) {
    throw new Error(`${destination} 已存在；使用 --force 替换${updating ? "已安装版本" : "它"}`);
  }

  await mkdir(options.target, { recursive: true });
  if (destinationExists) await rm(destination, { recursive: true, force: true });

  if (options.link) {
    await symlink(skill.directory, destination, "dir");
  } else {
    await cp(skill.directory, destination, { recursive: true });
  }

  console.log(`${updating ? "已更新" : "已安装"} ${name} → ${destination}${options.link ? "（软链接）" : ""}`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  if (!command || command === "-h" || command === "--help") {
    usage();
    return;
  }

  const { options, positional } = parseOptions(args.slice(1));

  if (command === "search") {
    const query = positional.join(" ").trim().toLowerCase();
    if (!query) throw new Error("search 需要查询词");
    const matches = (await listSkills()).filter(({ name, metadata }) =>
      [name, metadata.displayName, metadata.description, ...(metadata.tags ?? []), ...(metadata.scenarios ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
    if (matches.length === 0) {
      console.log("未找到匹配能力。");
      return;
    }
    for (const { name, metadata } of matches) {
      console.log(`${name}\t${metadata.type}\t${metadata.description}`);
    }
    return;
  }

  if (command === "validate") {
    let invalidCount = 0;
    for (const { name, directory, metadata } of await listSkills()) {
      const errors = validateMetadata(name, metadata);
      if (!(await exists(path.join(directory, "SKILL.md")))) errors.push("缺少 SKILL.md");
      if (errors.length > 0) {
        invalidCount += 1;
        console.error(`✗ ${name}: ${errors.join("；")}`);
      } else {
        console.log(`✓ ${name}`);
      }
    }
    if (invalidCount > 0) process.exitCode = 1;
    return;
  }

  const name = positional[0];
  if (!name || positional.length > 1) throw new Error(`${command} 需要且只接受一个技能名`);
  if (command === "install") return install(name, options);
  if (command === "update") return install(name, { ...options, force: true }, { updating: true });
  if (command === "uninstall") {
    const destination = path.join(options.target, name);
    if (!(await exists(destination))) throw new Error(`未找到已安装技能：${destination}`);
    await rm(destination, { recursive: true, force: true });
    console.log(`已卸载 ${name}：${destination}`);
    return;
  }

  throw new Error(`未知命令：${command}`);
}

main().catch((error) => fail(error.message));
