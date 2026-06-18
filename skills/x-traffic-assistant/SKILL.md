---
name: x-traffic-assistant
description: Find related high-traffic X posts for a user-provided X post, draft natural replies that can include the user's original post link, open selected posts in separate browser tabs, and fill reply boxes without submitting. Use when the user wants to drive traffic from relevant X discussions back to one of their own posts through manually reviewed comments.
---

# X Traffic Assistant

Use this skill to help the user distribute one of their own X posts into
relevant high-traffic discussions through thoughtful replies.

## Safety Boundary

- Never click Reply, Post, Send, or any equivalent publish action.
- Never submit, schedule, like, repost, quote, bookmark, follow, unfollow, or DM.
- Stop after writing each draft into the reply input box.
- Leave every staged reply visible for the user to review and publish manually.
- If the page, account, input box, or destination is ambiguous, stop and ask for
  confirmation.

## Required Input

Require one user-provided X post URL.

Before searching for target posts:

1. Open the user's source post.
2. Read the post text and visible context.
3. Extract the topic, claim, keywords, audience, and likely discussion angles.
4. Keep the original source post URL available for drafts.

If the source post cannot be opened or understood, stop and ask the user for the
post text or a corrected link.

## Source Discovery

Use X search as the default source for related high-traffic posts.

Search using:

- Direct keywords from the source post.
- Adjacent terms and synonyms.
- People, tools, products, companies, models, or events mentioned in the post.
- Natural-language discussion phrases that are likely to surface active threads.

Collect one round of up to 100 candidate posts, then stop collecting. Do not keep
scrolling indefinitely after the 100-post collection round is complete.

## Candidate Filtering

From the collected candidates, select 30 posts.

Prioritize:

- Strong relevance to the user's source post.
- High traffic, judged by views, replies, likes, and reposts together.
- Posts where a reply can naturally add context and point to the source post.
- Posts where the target post has a clear content gap that the user's source
  post can complement.
- Active discussions where the user's link would feel useful rather than forced.
- Posts with enough context to avoid generic comments.

Exclude:

- Political, highly controversial, hostile, sexual, illegal, or unsafe content.
- Pure ads, giveaway posts, obvious engagement bait, and low-signal marketing.
- Posts where adding the user's link would look spammy or off-topic.
- Posts that already cover the same angle as the user's source post, leaving no
  useful complementary gap.
- Posts where the user's account has already replied.
- Threads that require private context the agent cannot know.
- Medical, legal, financial, or other high-stakes advice contexts.

If fewer than 30 posts meet the standard, use fewer and explain why.

## Draft Strategy

Each draft should:

- Respond to the target post first.
- Add one concrete observation, implication, or useful angle.
- Identify what the target post does not cover, and use the source post link as
  a complementary next step.
- Include the user's source post link when it fits naturally.
- Use neutral handoff phrasing for the link instead of first-person self-promotion.
- Stay short: usually 1-2 sentences.
- Sound like a real participant in the discussion, not an ad.
- Use the same language as the target post unless the user asks otherwise.

Direct links are allowed. Prefer formats like:

- "这里有一份更完整的实操拆解：<source-url>"
- "这个角度可以接着看这份清单：<source-url>"
- "如果想看完整流程，这里整理得比较系统：<source-url>"
- "More practical workflow notes here: <source-url>"

Avoid:

- Copy-pasting the same line across many posts.
- Leading with the link before engaging with the target post.
- First-person promotional phrasing such as "我也写了一篇", "我刚写过",
  "I wrote", or "I also covered this".
- Overpromising, clickbait, hashtags, or sales language.
- Asking every target author to read the post.
- Posting the link where the relationship is weak.

## DeepSeek Drafting

If `scripts/deepseek-draft.mjs` exists and `DEEPSEEK_API_KEY` is configured,
prefer it for draft generation. Codex still owns source-post analysis,
candidate search, filtering, duplicate-reply checks, browser handling, and the
no-publish boundary.

Only send the minimum public source-post and target-post text needed for
drafting. Do not send private messages, cookies, browser storage, screenshots,
account settings, hidden page state, API keys, or personal files to DeepSeek.

Call it with JSON input shaped like:

```json
{
  "mode": "x-traffic",
  "sourcePost": {
    "text": "user source post text",
    "url": "https://x.com/php_martin/status/id"
  },
  "targetPost": {
    "author": "target author",
    "text": "target post text",
    "url": "https://x.com/user/status/id"
  },
  "style": {
    "tone": "natural, specific, non-promotional",
    "length": "1-2 short sentences",
    "language": "same-as-target"
  },
  "constraints": [
    "Respond to the target post first.",
    "Identify a useful gap the source post complements.",
    "Avoid first-person self-promotion.",
    "Do not submit or publish."
  ],
  "count": 1
}
```

If the script fails, returns an unusable draft, or is not configured, draft with
Codex directly and continue the workflow.

## Workflow

1. Open or use the user's authenticated X session.
2. Open the user-provided source post URL.
3. Analyze the source post into topic, keywords, and discussion angles.
4. Search X for related high-traffic discussions.
5. Collect one round of up to 100 candidate posts.
6. Filter and rank candidates by relevance first, then traffic.
7. Select 30 target posts.
8. Split the 30 posts into three batches of 10.
9. For each batch:
   - Recheck that the user's account has not already replied to each target
     post.
   - Generate one draft per target post, using the DeepSeek draft generator
     when available.
   - Open each selected target post in its own browser tab.
   - Place the matching draft into the reply input box.
   - Do not submit the reply.
10. After each batch of 10 is staged, pause and tell the user the batch is ready
    for manual review.
11. Continue to the next batch only after the user says to continue, such as
    "下一批".

## Drafting Heuristics

Use varied patterns:

- Connect the target post to the user's source post angle.
- Add a sharper framing, then link.
- Mention a related implication, then link.
- Point out a missing practical detail, checklist, workflow, or example, then
  link to the source post as the complement.
- Ask one focused question only when it helps the discussion.
- Use a light emoji only when it fits the local tone; do not add emoji to every
  draft.

Good structure:

```text
先回应对方这条帖子的核心点。再指出一个对方没有展开、但源帖能补上的角度。最后自然补一句：这里有一份更完整的实操拆解：<source-url>
```

Bad structure:

```text
看我的帖子 <source-url>
```

## Browser Handling

- Keep each selected target post in a separate tab.
- Match drafts to tabs carefully before writing.
- Before writing into a reply box, scan the visible conversation for an
  existing reply from the user's account. If one exists, skip that target and do
  not write another draft.
- If a reply box is hidden, use the normal reply affordance to reveal it, then
  stop before any publish action.
- If X changes layout or blocks interaction, stop and report the issue.
- If a draft cannot be safely inserted, leave that post untouched and move on.

## Final Response

When a batch is staged, report:

- Batch number and count staged.
- Any posts skipped during staging and why.
- A reminder that nothing was submitted.

Keep the final message brief. The user should review the live browser tabs and
publish manually.
