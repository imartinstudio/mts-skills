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
| `x-comment-expert` | skill | social | increase-engagement, draft-x-comments, review-following-timeline | x, comment, engagement, browser |
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

## CLI Direction

The first CLI should stay shell-friendly and predictable.

Target commands:

```sh
mts search <query>
mts install <name>
mts update <name>
mts uninstall <name>
mts validate
```

Initial behavior:

- `search`: match name, description, tags, and scenarios.
- `install`: copy or link a capability into a local Codex skill/plugin location.
- `update`: refresh an installed capability from this repository.
- `uninstall`: remove the installed copy or link.
- `validate`: check required files, JSON metadata, and path consistency.

Until the CLI exists, use `rg` for search:

```sh
rg "create-skill|mcp|plugin" skills README.md
```

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
