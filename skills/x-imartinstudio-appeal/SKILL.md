---
name: x-imartinstudio-appeal
description: Use when analyzing, updating evidence for, or drafting an X suspension appeal specifically for account @iMartinstudio, including X emails, suspicious-login notices, locked/read-only access, Premium billing notices, or an inauthentic-behavior decision.
---

# X @iMartinstudio Appeal

Treat every assertion as evidence-bound. This skill is only for `@iMartinstudio`; do not reuse facts, writing, or account details from any other X account.

## Evidence Rules

1. Read [references/evidence-profile.md](references/evidence-profile.md) before analyzing or drafting.
2. Separate statements into **verified**, **user-reported**, and **hypothesis**. Never convert a hypothesis into a fact.
3. Use the Gmail connector first when current X notices matter. Search `(from:notify@x.com OR from:verify@x.com OR from:info@x.com OR from:paidfeatures@x.com OR replyto:paidfeatures@x.com OR from:invoice+statements+acct_1Ika5JA3KZ32dPo1@stripe.com) in:anywhere`; read the matching bodies before citing them.
4. Treat IP geolocation as approximate. Do not say a VPN was the sole cause unless X explicitly states that.
5. Do not claim the account is a content creator, has posted manually, or has never used automation unless the current user supplies evidence for that exact claim. For this account, the user reports no posts or replies; state it as a user-reported fact unless independently verified.
6. Never include an email address, phone number, password, reset code, or other sensitive identifier in a reference file or draft unless the user explicitly asks for it in that request.

## Workflow

1. Confirm the target is `@iMartinstudio`. If it is another handle, do not use this skill.
2. Refresh the mail evidence when access is available, then compare it with the reference timeline.
3. Classify the current state: initial suspension, appeal pending, appeal denied, Premium/billing notice, or a login-page remediation flow.
4. Identify the narrowest defensible explanation. Current evidence supports repeated automated inauthentic-behavior lock decisions and anomalous-login signals; it does not identify a specific violating action.
5. Produce the requested output:
   - **Analysis:** timeline, evidence labels, uncertainty, and next safe step.
   - **Appeal draft:** form-text style, concise English first, Chinese reference second; request manual review and specific violation details.
   - **Follow-up comparison:** explain what changed since the last notice without inventing a new cause.
6. Stop at a copyable draft. Do not submit an appeal, create an account, or change X account settings.

## Drafting Pattern

Use a factual, non-accusatory structure for X's form text box, not an email format:

1. Identify `@iMartinstudio` and request a manual review.
2. State verified facts from the latest notice.
3. State the user-reported absence of posts/replies or automation only with that attribution.
4. Note completed security actions only when the user confirms them.
5. Ask X to identify the relevant conduct, date, or remediation step, and offer reasonable verification.

Do not add email subject lines, greetings, closings, or signatures unless the user explicitly asks for an email. Do not repeat a generic VPN-only explanation after an appeal denial. Do not promise evidence that is unavailable. Do not state that a human review is guaranteed.

## Historical-Record Boundary

If the user asks to inspect prior ChatGPT or Grok conversations, use only their existing authenticated browser session and read only the relevant conversation. Historical records for `@php_martin` are a separate-account reference: they may inspire structure, but cannot supply facts for `@iMartinstudio`.

## Output Checklist

- Mark the search scope and date coverage.
- Identify the latest status before recommendations.
- Quote no more than is necessary from notices.
- State uncertainty plainly.
- Confirm no external action was submitted.
