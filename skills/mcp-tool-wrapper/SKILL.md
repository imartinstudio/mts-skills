---
name: mcp-tool-wrapper
description: Use when designing a small MCP wrapper around an existing local command, API, or workflow.
license: MIT
---

# MCP Tool Wrapper

This capability helps turn a repeatable command, API call, or local workflow
into an MCP-oriented tool design.

## When To Use

Use this capability when the user wants to:

- Expose a local script as an MCP tool.
- Wrap a web API behind a stable tool schema.
- Design inputs and outputs for an agent-facing integration.
- Decide whether a workflow should become a skill, MCP server, or plugin.

Do not use it when a plain skill instruction is enough and no callable tool is
needed.

## Inputs

Look for:

- The underlying command, API, or workflow.
- Required arguments and optional arguments.
- Authentication or environment variables.
- Expected output shape.
- Failure modes the agent should handle.

## Workflow

1. Describe the tool boundary in one sentence.
2. Define the smallest stable input schema.
3. Define structured output fields.
4. Identify side effects such as file writes, network calls, or external state.
5. Document authentication and permission requirements.
6. Add examples for success, validation failure, and runtime failure.

## Output

Produce an MCP design note or implementation plan with:

- Tool name.
- Description.
- Input schema.
- Output schema.
- Permission and safety notes.
- Example calls.

## Notes

Prefer one precise tool over a broad tool that accepts arbitrary shell commands.
