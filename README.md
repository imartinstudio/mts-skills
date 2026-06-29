# MTS Skills

MTS Skills is a personal plugin market for managing reusable AI agent capabilities.
It starts as a plain Markdown and file-system catalog, with room to grow into a
public marketplace for skills, MCP integrations, and plugins.

## Goals

- Keep every capability easy to inspect, copy, install, and improve.
- Use a small repository shape that works well with Git.
- Support three capability types from the beginning: skill, MCP, and plugin.
- Make discovery practical through categories, tags, and use-case scenarios.
- Leave a path toward a CLI for search, install, update, and uninstall.

## Repository Layout

```text
.
├── README.md
├── LICENSE
├── scripts/
│   └── deepseek-draft.mjs
└── skills/
    ├── _template/
    ├── codex-skill-author/
    ├── mcp-tool-wrapper/
    └── plugin-manifest-review/
```

## Catalog

| Name | Type | Category | Scenarios | Tags |
| --- | --- | --- | --- | --- |
| `codex-skill-author` | skill | authoring | create-skill, improve-skill | codex, skill, writing |
| `mcp-tool-wrapper` | mcp | integration | wrap-api, expose-tool | mcp, tool, integration |
| `plugin-manifest-review` | plugin | quality | review-plugin, validate-manifest | plugin, manifest, review |
| `review-code-changes` | skill | quality | review-current-diff, review-pull-request, find-regressions | code-review, diff, compatibility, testing, security |
| `x-comment-expert` | skill | social | increase-engagement, draft-x-comments, review-following-timeline | x, comment, engagement, browser |
| `x-imartinstudio-appeal` | skill | social | analyze-imartinstudio-suspension, draft-imartinstudio-appeal, update-imartinstudio-evidence | x, appeal, suspension, gmail, account-security |
| `x-php-martin-appeal` | skill | social | analyze-php-martin-suspension, draft-php-martin-appeal, review-php-martin-163-mail | x, appeal, suspension, 163-mail, account-security |
| `x-reply-drafter` | skill | social | draft-single-x-reply, reply-to-x-post, reply-to-x-comment | x, reply, comment, browser |
| `x-traffic-assistant` | skill | social | drive-traffic-from-x, find-related-high-traffic-posts, draft-x-replies-with-link | x, traffic, comment, search |

## Capability Model

Each capability lives in its own directory under `skills/`.

Required files:

- `SKILL.md`: human-readable operating instructions.
- `skill.json`: marketplace metadata.

Recommended directory shape:

```text
skills/example-name/
├── SKILL.md
└── skill.json
```

## Metadata

Every `skill.json` should follow this shape:

```json
{
  "name": "example-name",
  "displayName": "Example Name",
  "description": "One concise sentence describing the capability.",
  "version": "1.0.0",
  "author": "Martin",
  "type": "skill",
  "category": "authoring",
  "tags": ["example", "skill"],
  "scenarios": ["create-skill"],
  "path": "skills/example-name",
  "entry": "SKILL.md",
  "license": "MIT",
  "compatibility": {
    "codexSkill": true,
    "mcp": false,
    "plugin": false
  }
}
```

Allowed `type` values:

- `skill`: a Codex or agent skill centered on `SKILL.md`.
- `mcp`: an MCP server, tool wrapper, or connector definition.
- `plugin`: a packaged plugin with manifest-oriented behavior.

## Discovery System

Use three discovery axes:

- Category: stable market navigation, such as `authoring`, `integration`, `quality`, `media`, `documents`, or `automation`.
- Tags: flexible keywords, such as `codex`, `mcp`, `browser`, `pdf`, `video`, or `github`.
- Scenarios: task-oriented search terms, such as `create-skill`, `publish-article`, `review-plugin`, or `wrap-api`.

## CLI

`mts` 是一个零依赖的本地命令行工具，用于搜索、校验和安装本仓库中的能力。需要 Node.js 18 或更高版本。

在仓库根目录中使用：

```sh
npm run mts -- search <query>
npm run mts -- install <name>
npm run mts -- update <name>
npm run mts -- uninstall <name>
npm run validate
```

也可在本机全局安装命令：

```sh
npm link
mts search code-review
```

默认安装目录是 `~/.codex/skills`。执行 `install`、`update` 或 `uninstall` 才会写入该目录；可用 `--target <目录>` 改为项目级或其他目标目录。为防止意外覆盖，同名安装已存在时需要传入 `--force`；`--link` 会创建软链接而非复制文件。

```sh
mts install review-code-changes
mts install review-code-changes --target .agents/skills
mts update review-code-changes --link
mts uninstall review-code-changes
```

命令行为：

- `search`: match name, description, tags, and scenarios.
- `install`: 复制或软链接能力至本地 Codex 技能目录或指定目录。
- `update`: 用市场中的当前版本替换已安装版本。
- `uninstall`: 移除已安装的副本或链接。
- `validate`: check required files, JSON metadata, and path consistency.

## Local Draft Generator

The X-related skills can optionally use a lightweight DeepSeek draft generator:

```sh
node scripts/deepseek-draft.mjs < input.json
```

Required environment variable:

```sh
DEEPSEEK_API_KEY=...
```

Optional environment variables:

```sh
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

Dry-run without network or API key:

```sh
node scripts/deepseek-draft.mjs --example | node scripts/deepseek-draft.mjs --dry-run
```

This script is intentionally local and small. If its prompt and output shape
stabilize, it can later be wrapped as an MCP server and packaged as a plugin.

### Security Notes

- Never commit `.env`; use `.env.example` as the template.
- Only send public X post/comment text that is needed for drafting.
- Do not send private messages, cookies, browser storage, screenshots, account
  settings, API keys, personal files, or hidden page state to DeepSeek.
- The script strips query strings from X URLs and truncates long text before
  sending it to the API.
- `--dry-run` prints the assembled prompt. Treat that output as sensitive when
  it contains real post text.
- The script performs basic output checks, but Codex must still review every
  draft before writing it into the browser.
- DeepSeek is an external provider. Any text sent to it leaves the local
  machine and is subject to that provider's terms and privacy policy.

## Validation Rules

For every directory under `skills/` except `_template`:

- `SKILL.md` must exist.
- `skill.json` must exist and be valid JSON.
- `skill.json.name` must match the directory name.
- `skill.json.path` must match `skills/<name>`.
- `version` must use `major.minor.patch`, for example `1.0.0`.
- `type` must be `skill`, `mcp`, or `plugin`.
- `tags` and `scenarios` must be non-empty arrays.

## Creating a New Capability

1. Copy `skills/_template` to `skills/<new-name>`.
2. Rename metadata values in `skill.json`.
3. Rewrite `SKILL.md` so it tells an agent exactly when and how to use the capability.
4. Add the new item to the catalog table in this README.
5. Run a JSON syntax check:

```sh
find skills -name skill.json -print -exec ruby -rjson -e 'JSON.parse(File.read(ARGV[0])); puts "ok #{ARGV[0]}"' {} \;
```

## Contribution Principles

- Prefer small, inspectable capabilities over broad bundles.
- Write instructions for real agent behavior, not marketing copy.
- Make dependencies explicit.
- Keep installation reversible.
- Document limitations and non-goals.

## License

MIT
