---
name: x-reply-drafter
description: Draft one best natural reply for a single X post or comment from a provided X URL or status ID, judge whether it is worth replying, open the target in the browser when needed, write the draft into the reply box, and stop without submitting or publishing. Use when the user wants help replying to one specific X post, status, thread item, or comment.
---

# X Reply Drafter

Use this skill to help the user reply to one specific X post or comment with a
single high-quality draft.

## Safety Boundary

- Never click Reply, Post, Send, or any equivalent publish action.
- Never submit, schedule, like, repost, quote, bookmark, follow, unfollow, or DM.
- Stop after writing the draft into the reply input box.
- Leave the staged reply visible for the user to review and publish manually.
- If the target post, target comment, account, or input box is ambiguous, stop
  and ask for confirmation.

## Input

Accept:

- A full X URL, such as `https://x.com/user/status/123`.
- A status URL with query parameters, such as `?s=20`.
- A bare status ID, if enough context is available to construct or locate the
  target.

If the user provides only a bare ID and no author handle or URL:

- Try to resolve it only when the browser can open the status reliably.
- If resolution fails, ask the user for the full X URL or pasted post text.

## Context Reading

Before drafting:

1. Open the target post or comment in the user's authenticated X session.
2. Read the target text and visible conversation context.
3. Identify whether the target is an original post, quoted post, reply, or
   nested comment.
4. If replying to a comment, understand the parent post enough to avoid replying
   out of context.
5. Check whether the user's account has already replied in the visible
   conversation. If it has, tell the user and ask before writing another reply.

## Worth-Replying Check

Before writing, decide whether the target is worth replying to.

Reply when:

- A concise response can add context, warmth, agreement, disagreement, or a
  useful question.
- The target is relevant to the user's public voice or current goal.
- The conversation appears safe and non-hostile.
- The draft can sound natural without inventing personal experience.

Do not draft automatically when:

- The target is political, highly controversial, hostile, sexual, illegal, or
  unsafe.
- The target asks for medical, legal, financial, or other high-stakes advice.
- The target is pure marketing, giveaway bait, spam, or low-signal engagement
  bait.
- The required context is private, missing, or unclear.
- A reply would likely look forced or reputationally risky.

If not worth replying, explain the reason briefly and suggest one safer
alternative, such as liking privately, skipping, or asking the user for the tone
they want.

## Draft Style

Generate exactly one best reply by default.

The reply should be:

- Natural, specific, and human-sounding.
- Short: usually 1-2 sentences.
- Useful enough to add value to the target conversation.
- In the same language as the target unless the user asks otherwise.
- Free of generic praise as the whole reply.
- Free of unsupported claims about the user's personal experience.

Use light emoji only when the target tone makes it feel natural. Do not force
emoji into serious, technical, or sensitive replies.

## Link Policy

Do not include links or traffic-driving content unless the user explicitly asks
for it in this request.

If the user asks to include a link:

- Respond to the target post first.
- Add the link only when it is directly relevant.
- Avoid first-person promotional phrasing such as "我也写了一篇", "我刚写过",
  "I wrote", or "I also covered this".
- Prefer neutral handoff phrasing, such as "这里有一份更完整的拆解".

## Workflow

1. Receive the target URL or status ID.
2. Open the target in the browser.
3. Read the target and visible context.
4. Determine whether it is worth replying.
5. If it is not worth replying, stop and explain why.
6. Draft one best reply.
7. Locate the correct reply input box for the target.
8. Write the draft into the reply input box.
9. Do not submit or publish.
10. Tell the user the draft is staged for review.

## Browser Handling

- Use the normal X reply affordance when the reply input box is hidden.
- For nested comments, make sure the reply box belongs to the intended comment,
  not the parent post or a different reply.
- If multiple reply boxes are visible and the correct one is not obvious, stop
  and ask the user to confirm.
- If X changes layout, blocks interaction, or shows a CAPTCHA, stop and report
  the issue.

## Final Response

After staging the draft, report:

- That one reply draft was written.
- Whether anything was skipped or uncertain.
- A reminder that nothing was submitted.

Keep the final response brief because the user will review the browser state.
