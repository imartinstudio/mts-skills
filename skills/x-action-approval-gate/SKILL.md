---
name: x-action-approval-gate
description: Review, stage, and gate X publishing or account actions from browser, OpenClaw, TweetClaw, MCP, or local automation workflows before anything is submitted.
---

# X Action Approval Gate

Use this skill when an agent workflow may draft, stage, schedule, publish, like,
repost, quote, follow, unfollow, DM, or otherwise change an X account.

## Safety Boundary

- Never submit, publish, schedule, like, repost, quote, bookmark, follow,
  unfollow, or DM without the user's explicit final approval for that exact
  action.
- Treat browser sessions, cookies, local storage, screenshots, account settings,
  private messages, and API keys as private. Do not copy them into prompts,
  logs, files, or external services.
- Keep drafting separate from staging, staging separate from approval, and
  approval separate from execution.
- If the target account, target post, draft text, action type, or approval state
  is ambiguous, stop and ask for confirmation.
- Approval expires when the draft, target, account, or action changes.

## Inputs

Look for:

- The intended action, such as reply, post, quote, like, repost, follow,
  unfollow, schedule, or DM.
- The target X URL, account handle, conversation, or draft text.
- The execution surface, such as browser UI, OpenClaw plugin, TweetClaw plugin,
  MCP tool, CLI, or local script.
- Any user constraints for tone, language, timing, audience, or risk.

## Review Checklist

Before staging any action:

1. Verify the target account and target post or profile.
2. Verify the acting account when the UI or tool exposes it safely.
3. Check for duplicates, especially replies or posts already visible from the
   acting account.
4. Confirm the content does not expose private data, credentials, hidden page
   state, or unsupported claims.
5. Confirm the action is reversible only when the platform actually supports a
   safe undo path.
6. Prefer a draft-only or preview-only mode when the tool supports it.

## Workflow

1. Identify the exact action and execution surface.
2. Read only the minimum visible public context needed for the action.
3. Draft or revise the content without publishing.
4. Stage the action only when the target, account, and draft are unambiguous.
5. Present a compact approval summary with:
   - acting account when safely visible,
   - target URL or handle,
   - action type,
   - exact draft text or non-text action,
   - known risks or skipped checks.
6. Wait for explicit approval for that exact summary.
7. Execute only the approved action. If anything changes, return to step 5.

## Output

When approval is pending, report:

- The staged action.
- The exact target.
- The exact draft or non-text action.
- The remaining approval needed.

When the user declines or does not approve, leave the action unsubmitted and
state that nothing was changed.

## Notes

- This skill can wrap more specialized X skills, including reply drafting,
  traffic-assistant, browser-driven posting, TweetClaw/OpenClaw plugin flows, or
  MCP tools.
- It is not a content strategy skill. Use it to enforce the action boundary,
  evidence check, and final approval step.
