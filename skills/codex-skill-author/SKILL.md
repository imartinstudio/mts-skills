---
name: codex-skill-author
description: Use when drafting or improving a Codex skill with clear trigger rules, workflow steps, and validation guidance.
license: MIT
---

# Codex Skill Author

This capability helps create or improve a Codex-style `SKILL.md`.

## When To Use

Use this capability when the user wants to:

- Create a new skill from an idea or repeated workflow.
- Rewrite a vague skill into actionable agent instructions.
- Add trigger rules, workflow steps, validation, or safety notes.
- Prepare a skill for inclusion in this marketplace.

Do not use it for general project documentation unless the output is meant to
become an executable agent skill.

## Inputs

Look for:

- The skill name.
- The task the skill should handle.
- The target tools, files, APIs, or user workflow.
- Any examples of good and bad usage.
- Installation or dependency constraints.

## Workflow

1. Identify the exact trigger conditions.
2. Define what the skill should read before acting.
3. Write a short, deterministic workflow.
4. Add validation steps that prove the skill worked.
5. Add non-goals so the skill does not over-trigger.
6. Keep examples concrete and local to the intended use case.

## Output

Produce a `SKILL.md` with:

- YAML front matter.
- Clear `When To Use` and `Do Not Use` sections.
- A step-by-step workflow.
- Inputs, outputs, and validation notes.
- Any required relative file references.

## Quality Bar

A good skill should let another agent perform the workflow without needing the
original author in the loop.
