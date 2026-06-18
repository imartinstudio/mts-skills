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
- Skip plain reposts.

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

Questions are allowed, but do not make every reply a question. Mix agreement,
specific additions, concise reactions, and occasional open-ended questions.

## Workflow

1. Open or use the user's authenticated X session.
2. Navigate to the Following timeline.
3. Collect one batch of up to 100 posts.
4. Remove skipped items such as plain reposts and unsafe or low-signal posts.
5. Rank the remaining posts by interaction value.
6. Select 30 posts.
7. Split the selected posts into three batches of 10.
8. For each batch:
   - Generate one draft per post.
   - Open each selected post in its own browser tab.
   - Place the matching draft into the reply input box.
   - Do not submit the reply.
9. After each batch of 10 is staged, pause and tell the user the batch is ready
   for manual review.
10. Continue to the next batch only after the user asks to proceed.

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
- If a reply box is hidden, open it using the normal reply affordance, then stop
  before any publish action.
- If X changes layout or blocks interaction, stop and report the issue.
- If a draft cannot be safely inserted, leave that post untouched and move on.

## Final Response

When a batch is staged, report:

- Batch number and count staged.
- Any posts skipped during staging and why.
- A reminder that nothing was submitted.

Keep the final message brief. The important state is in the browser tabs for
the user to inspect.
