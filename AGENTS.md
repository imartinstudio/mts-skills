# AGENTS.md

## 项目边界

- 本项目的 `skills/` 目录是插件市场源码和候选能力库，不是 Codex/Agent 的自动加载技能目录。
- 不要把 `skills/` 下的能力自动复制、链接或同步到全局技能目录。
- 不要在没有明确用户指令的情况下写入 `~/.codex/skills`、`~/.agents/skills` 或其他全局/用户级技能位置。
- 只有当用户明确执行安装动作，或未来插件市场提供手动安装流程时，才可以把某个能力安装到用户自己的可用位置。
- 如果需要让某个技能仅在本项目中被 Codex 自动发现，应放到 `.agents/skills/`，并在动手前向用户确认。

## 开发约定

- 所有回复使用中文。
- 优先保持项目结构简单，当前核心目录是 `skills/` 和根文档。
- 修改技能市场条目时，同时维护对应的 `SKILL.md` 和 `skill.json`。
- 新增能力时，确保 `skill.json.name` 与目录名一致，`skill.json.path` 使用 `skills/<name>`。

## Git 规范

- 分支使用小写 kebab-case，并按改动类型加前缀：新增能力或功能用 `feat/<描述>`，缺陷修复用 `fix/<描述>`，维护性改动用 `chore/<描述>`，文档改动用 `docs/<描述>`，重构用 `refactor/<描述>`，性能优化用 `perf/<描述>`，测试改动用 `test/<描述>`。
- 从 `main` 创建工作分支；不要直接在 `main` 上提交或推送。一个分支只承载一个可独立审查的主题。
- 提交信息使用 Conventional Commits：`<type>(<可选范围>): <简短祈使描述>`，例如 `feat(skills): add code review skill`、`fix(x-comment-expert): count eligible posts only`。标题使用英文、小写开头、无句号，长度尽量不超过 72 个字符。
- 提交应保持原子性：不要将无关格式化、重构或用户已有改动混入同一提交；提交前检查 `git diff` 与 `git status`。
- 推送前至少运行与改动相关的校验；文档或技能清单改动至少运行 `git diff --check`，并验证修改的 `skill.json` 是合法 JSON 且 `name`、`path` 与目录一致。
- PR 默认以 `main` 为目标分支并创建为草稿；标题使用与提交一致的 Conventional Commit 风格。PR 描述需说明改动内容、原因/影响、已运行的验证，以及未覆盖的风险或检查。
- 不强推共享分支、不改写已发布提交；需要变更已推送分支时，优先追加提交。删除远端分支前确认它已被替代或已合并。
