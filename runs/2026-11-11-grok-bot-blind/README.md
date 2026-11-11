# Grok Bot, blind runs, 11 November 2026

Grok Bot 0.79.4, a fresh Bot per brief, working from a folder with only pdf/, registers/, mail/ and the two quote checkers. The prompts are in this folder. Scored afterwards with check/score_brief.py on another machine.

| Brief | Figures | Issues | Rejected | Time |
|---|---|---|---|---|
| ic-memo | 11/12 | 9/9 | 0 | 5 min 07 s |
| am-update | 8/8 | 8/8 | 0 | about 5 min |

The miss: purchaser costs given as GBP 146,200 (6.8% of the price); the prompt did not say "percentage". Fixed in briefs.json since.
Both outputs flag more than the answer key: flat 5C's notice to leave (mail m18), no tenancy for flat 1A, no certificates for 1A, 3A and 4B.
