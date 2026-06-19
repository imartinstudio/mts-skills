---
name: x-comment-expert
description: Generate and stage thoughtful X comment drafts to increase authentic engagement from the user's Following timeline. Use when the user wants Codex to scan about 100 X posts, select 30 safe high-value posts, draft short natural replies, open each selected post in its own browser tab, and fill the reply box without submitting or publishing.
---

# X Comment Expert

Use this skill to help the user increase authentic interaction on X by selecting
good posts from the Following timeline and staging comment drafts for manual
review.

## Safety Boundary

- Never click Reply, Post, Send, or any equivalent publish action.
- Never submit, schedule, like, repost, quote, bookmark, follow, unfollow, or DM.
- Stop after writing each draft into the reply input box.
- Leave every staged comment visible for the user to review and publish manually.
- If the browser, page, or input state is ambiguous, stop and ask for confirmation.

## Source Scope

- Use the X Following timeline as the default source.
- Collect exactly one round of up to 100 visible posts, then stop collecting.
- Do not continue scrolling after the 100-post collection round is complete.
- Include original posts and quote posts.
- Skip plain reposts, ordinary replies, nested comments, and thread comments.
- During collection, filter out any candidate whose visible article text
  contains a reply marker such as `回复 @...` or `Replying to @...`.

## Engagement Floor

Before selecting targets, extract or visibly inspect each candidate's age,
views, replies, reposts, and likes. Do not select candidates whose views or
engagement cannot be inspected.

Use these default minimums unless the user explicitly asks for a different
threshold:

- 0-6 hours old: at least 1,000 views, or clear evidence that views and
  interactions are rising quickly.
- 6-24 hours old: at least 3,000 views.
- 24-72 hours old: at least 10,000 views, with recent replies or reposts still
  appearing.
- Older than 72 hours: skip by default unless the post has 50,000+ views and
  active recent discussion.

Do not use low-view posts to fill a batch. If fewer than 10 candidates meet the
engagement floor and quality standard, stage fewer than 10 and explain that the
remaining candidates were below the engagement floor.

## Filtering

From the 100 collected posts, select 30 posts that are most likely to support
natural, useful, relationship-building replies.

Prefer posts that:

- Invite a concrete reaction, addition, observation, or question.
- Are relevant to the user's interests, work, or public voice.
- Can be answered in 1-2 specific sentences.
- Are recent enough that a reply still feels timely.
- Have enough context to avoid generic comments.

Exclude posts that:

- Are political, highly controversial, hostile, sexual, illegal, or unsafe.
- Are ordinary replies, nested comments, or thread comments. Use only original
  posts and quote posts as batch comment targets.
- Are below the engagement floor, have hidden/unavailable views, or appear to
  have stale engagement.
- Are obvious ads, giveaways, engagement bait, or low-signal marketing.
- Depend on private context the agent cannot know.
- Require medical, legal, financial, or other high-stakes advice.
- Would push the user into an argument or reputationally risky thread.

## Draft Style

Write each draft as:

- Natural, friendly, and specific.
- Short: usually 1-2 sentences.
- Opinionated enough to be worth posting.
- Human-sounding, not formulaic or praise-only.
- In the same language as the source post unless the user asks otherwise.
- No first-person promotional phrasing or AI-flavored self-reference such as
  "我也写了一篇", "我刚写过", "我刚写了篇", "我整理了", "我这里",
  "我这篇", "我这边", "I wrote", or "I also covered this".
- If a reply links to the user's own content, introduce it as a useful
  reference, checklist, concept map, or workflow note, not as "my post" or
  something the user personally wrote.

Questions are allowed, but do not make every reply a question. Mix agreement,
specific additions, concise reactions, and occasional open-ended questions.

## DeepSeek Drafting

If `scripts/deepseek-draft.mjs` exists and `DEEPSEEK_API_KEY` is configured,
prefer it for draft generation. Codex still owns selection, safety checks,
browser handling, and the no-publish boundary.

Only send the minimum public target-post text needed for drafting. Do not send
private messages, cookies, browser storage, screenshots, account settings,
hidden page state, API keys, or personal files to DeepSeek.

Call it with JSON input shaped like:

```json
{
  "mode": "x-comment",
  "posts": [
    {
      "author": "target author",
      "text": "target post text",
      "url": "https://x.com/user/status/id"
    }
  ],
  "style": {
    "tone": "natural, friendly, specific, human-like",
    "length": "1-2 short sentences",
    "language": "same-as-target",
    "emoji": "sparingly"
  },
  "constraints": [
    "Do not submit or publish.",
    "Avoid generic praise.",
    "Do not invent personal experience."
  ],
  "count": 1
}
```

If the script fails, returns an unusable draft, or is not configured, draft with
Codex directly and continue the workflow.

## Workflow

1. Open or use the user's authenticated X session.
2. Navigate to the Following timeline.
3. Collect one batch of up to 100 posts.
4. Remove skipped items such as plain reposts, ordinary replies, nested
   comments, and unsafe or low-signal posts.
5. Extract age, views, replies, reposts, and likes for each candidate where
   visible.
6. Remove candidates below the engagement floor.
7. Rank the remaining posts by interaction value.
8. Select up to 30 posts.
9. Split the selected posts into batches of up to 10.
10. For each batch:
   - Generate one draft per post, using the DeepSeek draft generator when
     available.
   - Open each selected post in its own browser tab.
   - Recheck that the target is an original post or quote post, not a reply.
   - Place the matching draft into the target page's inline reply input box,
     keeping the original post page visible.
   - After filling the inline reply input, verify that the inline reply button
     on that page is enabled. If it remains disabled or unusable even though the
     draft text is present, only then may the agent fall back to opening the
     normal reply composer.
   - Do not submit the reply.
11. After each batch is staged, pause and tell the user the batch is ready for
   manual review.
12. Continue to the next batch only after the user asks to proceed.

## Drafting Heuristics

Use these patterns, varying them naturally:

- Add a concrete supporting angle: "This especially matters when..."
- Reflect a useful implication: "The part I keep coming back to is..."
- Offer a concise related observation.
- Ask one focused follow-up question when the post genuinely invites it.
- Acknowledge the post without exaggeration.

Avoid:

- "Great point" as a complete reply.
- Generic praise with no added value.
- Overly long explanations.
- Hashtags, sales language, or obvious growth tactics.
- Claims about the user's experience that are not supported by context.

## Browser Handling

- Keep each selected post in a separate tab.
- Match drafts to tabs carefully before writing.
- Before writing into a reply box, scan the target post itself. If it is a
  reply post or nested comment, skip it and do not write a draft.
- Before writing into a reply box, scan the visible replies below the target
  post for an existing reply from the user's account. Treat `Martin` followed
  by `@php_martin` as a hard duplicate signal. If one exists, skip that target
  and do not write another draft.
- If a duplicate reply is discovered after a draft was already inserted, clear
  the draft immediately and report the target as skipped. Never leave a second
  draft on a post that already has a reply from the user's account.
- Default to the inline reply composer on the target post page. Prefer the
  visible `发布你的回复` / `Post your reply` input beneath the post, so the user can
  still inspect views, engagement, author context, and surrounding replies.
- Do not click the post's reply button or open `/compose/post` by default. The
  modal composer hides page context and should be treated as a fallback, not the
  normal path.
- After filling the inline composer, check that the inline reply button is
  enabled. Leave the draft there when it is enabled.
- Fall back to the normal reply affordance/modal only when the inline composer
  exists, accepts the draft text, but its inline reply button remains disabled
  or otherwise cannot be used. When this fallback is used, report the affected
  post and the reason.
- If the inline reply box is absent or hidden, scroll the target page and check
  the post detail page again before using any modal fallback.
- If X changes layout or blocks interaction, stop and report the issue.
- If a draft cannot be safely inserted, leave that post untouched and move on.

## Final Response

When a batch is staged, report:

- Batch number and count staged.
- Any posts skipped during staging and why.
- A reminder that nothing was submitted.

Keep the final message brief. The important state is in the browser tabs for
the user to inspect.
