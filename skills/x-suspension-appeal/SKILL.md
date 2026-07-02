---
name: x-suspension-appeal
description: Use when analyzing or drafting an X suspension, lock, read-only, reach-limiting, inauthentic-behavior, spam, platform-manipulation, or account-access appeal without storing account-specific evidence in the repository.
---

# X Suspension Appeal

Use this skill for X account suspension, lock, read-only, reach-limiting, account-access, spam, inauthentic-behavior, or platform-manipulation appeal work.

Core rule: keep the reusable workflow in this repository, and keep account-specific facts outside Git.

## Privacy Boundary

- Do not write handles, email addresses, phone numbers, billing details, notice timelines, screenshots, login locations, IP/VPN details, case IDs, or account-specific allegations into this repository.
- If the user supplies account evidence during the conversation, use it for the current answer only unless they explicitly provide a private non-Git storage location.
- If durable evidence is needed, ask for or use a private ignored path such as `.private/x-appeals/<case>.md`; never create that file unless the user explicitly asks.
- Do not copy passwords, cookies, verification codes, reset links, private message contents, or raw mail headers into any file.

## Evidence Discipline

Classify every material statement as one of:

- **Verified:** read from a current X notice, account UI, user-provided screenshot, or connected mailbox in the current task.
- **User-reported:** stated by the user but not independently verified during the current task.
- **Hypothesis:** possible explanation, such as login-risk, network, VPN, device, content, automation, or platform-manipulation signals.

Never turn a hypothesis into a fact. Never reuse facts from one X account for another account.

## Workflow

1. Identify the target account only in the current working context; do not persist it in repo files.
2. Refresh current evidence when the user authorizes mailbox, browser, or screenshot inspection.
3. Classify the current state:
   - initial suspension,
   - appeal pending,
   - appeal denied,
   - read-only or locked account,
   - reach limitation or label,
   - missing or unclear remediation path,
   - billing/subscription context while access is restricted.
4. Extract only the appeal-relevant facts:
   - latest X decision or notice,
   - what X did and did not specify,
   - what remediation path is visible,
   - user-reported account behavior,
   - confirmed security or verification steps.
5. Draft a concise appeal for the correct channel.
6. Stop at draft text unless the user explicitly asks to submit through a visible official form.

## Drafting Rules

- Default to X form text, not email format.
- Use email format only when the user explicitly says the appeal channel is email.
- Request manual review and a specific explanation of the conduct, date, content, technical signal, or remediation step.
- Do not claim a human review is guaranteed.
- Do not accuse X or overstate certainty.
- Do not say VPN, travel, device changes, or login location caused the issue unless X explicitly says so.
- Do not repeat identical appeals. Later appeals should reference new facts, missing remediation, repeated template denials, or the absence of specific violation details.
- Keep contact fields as placeholders unless the user explicitly wants personal details inserted.

## Output Pattern

For analysis:

- Current status.
- Evidence used and date coverage.
- Verified facts, user-reported facts, hypotheses, and unknowns.
- Recommended next step.

For drafts:

1. English form text.
2. Chinese reference translation, unless the user asks for one language only.
3. Brief evidence note naming only categories of evidence, not private identifiers.
4. Confirmation that nothing was submitted.

## Common Appeals

Use these angles only when evidence supports them:

- X repeated an automated decision without identifying specific conduct.
- The account UI does not provide the remediation path mentioned in the notice.
- The user is willing to complete reasonable verification or security steps.
- The stated reason does not match verified or user-reported account activity.
- A paid subscription appears active while account functionality is restricted.
