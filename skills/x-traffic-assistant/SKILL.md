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

During this first collection round, collect only standalone original posts and
quote posts. Do not collect ordinary replies or nested conversation comments.
Filter replies immediately instead of carrying them into candidate ranking.

Treat a candidate as an ordinary reply and exclude it when any of these signals
are present:

- The collected article text contains a reply marker such as `回复 @...` or
  `Replying to @...`.
- The candidate is only visible as a child comment in another conversation.
- The candidate depends on a parent comment for meaning and is not a standalone
  discussion starter.

Quote posts are allowed when the user's source post can naturally complement the
author's own quote text. Do not treat a quote post as invalid merely because it
contains a quoted post below the author's own text.

## Traffic Floor

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
traffic floor and relevance standard, stage fewer than 10 and explain that the
remaining candidates were below the traffic floor.

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
- Ordinary reply posts, nested comments, or thread comments. Use only original
  posts and quote posts as traffic targets.
- Posts below the traffic floor, posts with hidden/unavailable views, or posts
  whose engagement appears stale.
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
- Include the user's source post link only when it fits naturally.
- Use neutral handoff phrasing for the link instead of first-person
  self-promotion. Present the link as a useful reference, checklist,
  explanation, or concept map, not as "my post".
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
- First-person promotional phrasing or AI-flavored self-reference such as
  "我也写了一篇", "我刚写过", "我刚写了篇", "我整理了", "我这里",
  "我这篇", "我这边", "I wrote", or "I also covered this".
- Phrases that make the user's post sound like an inserted ad, such as
  "可以看看我的帖子", "这篇是我写的", "顺便引流一下", or equivalent wording.
- Overpromising, clickbait, hashtags, or sales language.
- Asking every target author to read the post.
- Posting the link where the relationship is weak.

Before writing any draft into X, run a wording self-check. If the draft contains
first-person link promotion, "I/my" ownership language around the source post,
or a generic "I wrote/整理/分享" bridge, rewrite it. Acceptable bridges should be
content-centered, for example "这个概念框架可以对照看", "这里有一份更系统的拆解",
"这份清单能补上工具和 Skill 的边界", or "相关流程可以参考这里".

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
5. Collect one round of up to 100 candidate posts, filtering out ordinary
   replies during collection.
6. Extract age, views, replies, reposts, and likes for each candidate where
   visible.
7. Filter out candidates below the traffic floor.
8. Filter and rank original posts and quote posts by relevance first, then
   traffic.
9. Select up to 30 target posts.
10. Split the selected posts into batches of up to 10.
11. For each batch:
   - Recheck that each target is an original post or quote post, not a reply.
   - Recheck on the target post detail page that the user's account has not
     already replied to each target post. Inspect the visible replies section
     below the target post for the user's display name and handle, such as
     `Martin` / `@php_martin`; do not rely only on search results.
   - If an existing reply from the user's account is found, skip that target
     immediately. Do not generate a new draft, do not write into the reply box,
     and report it as `already replied`.
   - Generate one draft per target post, using the DeepSeek draft generator
     when available.
   - Open each selected target post in its own browser tab.
   - Place the matching draft into the target page's inline reply input box,
     keeping the original post page visible.
   - After filling the inline reply input, verify that the inline reply button
     on that page is enabled. If it remains disabled or unusable even though the
     draft text is present, only then may the agent fall back to opening the
     normal reply composer.
   - Do not submit the reply.
12. After each batch is staged, pause and tell the user the batch is ready for
    manual review.
13. Continue to the next batch only after the user says to continue, such as
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
- Before writing into a reply box, scan the target post itself. If it is a
  reply post or nested comment, skip it and do not write a draft.
- Before writing into a reply box, scan the visible conversation for an
  existing reply from the user's account. Treat `Martin` followed by
  `@php_martin` in the replies below the target post as a hard duplicate signal.
  If one exists, skip that target and do not write another draft.
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

Keep the final message brief. The user should review the live browser tabs and
publish manually.
