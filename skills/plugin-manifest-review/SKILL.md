---
name: plugin-manifest-review
description: Use when reviewing a plugin manifest for clarity, completeness, installability, and marketplace readiness.
license: MIT
---

# Plugin Manifest Review

This capability reviews plugin metadata before a plugin is published or added
to a local marketplace.

## When To Use

Use this capability when the user wants to:

- Review a plugin manifest.
- Check whether a plugin is ready for marketplace indexing.
- Improve naming, descriptions, categories, or install notes.
- Compare a plugin manifest against local marketplace expectations.

Do not use it for source-code review unless manifest behavior depends on the
code.

## Inputs

Look for:

- Plugin manifest file.
- README or usage documentation.
- Referenced skills, MCP servers, apps, or assets.
- Install and compatibility notes.
- License information.

## Workflow

1. Read the manifest and directly referenced documentation.
2. Check required fields for completeness.
3. Verify names and paths are consistent.
4. Check whether descriptions explain user value rather than implementation only.
5. Identify missing install, update, or uninstall information.
6. Report findings by severity, then suggest a concise fix.

## Output

Return:

- Blocking issues.
- Non-blocking improvements.
- Marketplace metadata suggestions.
- A final readiness verdict.

## Review Criteria

A plugin is marketplace-ready when a new user can understand what it does,
install it, and remove it without asking the author for hidden context.
