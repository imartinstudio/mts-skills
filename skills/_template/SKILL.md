---
name: example-name
description: Use this template when creating a new marketplace capability.
license: MIT
---

# Example Name

Use this file to describe how an agent should use the capability.

## When To Use

Use this capability when:

- The user asks for a task this capability directly supports.
- The current project context matches the assumptions below.
- The required files, tools, or APIs are available.

Do not use this capability when:

- The request is outside the scope described here.
- A simpler built-in workflow is enough.
- Required dependencies are missing and cannot be safely installed.

## Inputs

Document the inputs the agent should look for:

- User-provided goal or task.
- Relevant files or directories.
- Required environment variables or credentials.
- Optional preferences that change the output.

## Workflow

1. Read the local project context before acting.
2. Confirm required inputs are present.
3. Run the smallest useful workflow.
4. Validate the output.
5. Summarize what changed and any remaining risk.

## Output

Describe the expected output:

- Files created or modified.
- Commands run.
- Final message format.
- Follow-up actions the user may want.

## Notes

Keep this section for limitations, edge cases, and implementation hints.
