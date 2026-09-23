# Suggestion Issue tracker（加强版 W1+）

目标：W2 末累计 **发出 ≥20**（G1）。Bot 只起草；**人审核后**用本账号发 Issue。

| # | repo | issue_url | date | reply? | installed? | retained_14d? | notes |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | npm/node-semver | https://github.com/npm/node-semver/issues/900 | 2026-09-07 | | | | OPEN；从未 soft FU（Prefer） |
| 2 | ajv-validator/ajv | https://github.com/ajv-validator/ajv/issues/2670 | 2026-09-07 | | | | OPEN；从未 soft FU（Prefer） |
| 3 | holistics/dbml | https://github.com/holistics/dbml/issues/969 | 2026-09-08 | N | | | **decline**（2026-09-17 scan） |
| 4 | duckduckgo/content-scope-scripts | https://github.com/duckduckgo/content-scope-scripts/issues/3022 | 2026-09-08 | | | | OPEN；从未 soft FU（Prefer） |
| 5 | mento-protocol/frontend-monorepo | https://github.com/mento-protocol/frontend-monorepo/issues/927 | 2026-09-08 | | | | OPEN；从未 soft FU（Prefer） |
| 6 | rudderlabs/rudder-sdk-js | https://github.com/rudderlabs/rudder-sdk-js/issues/3198 | 2026-09-09 | N | | | **decline**（2026-09-17 scan） |
| 7 | ardatan/whatwg-node | https://github.com/ardatan/whatwg-node/discussions/3566 | 2026-09-09 | | | | **Discussion**（非 Issue） |
| 8 | langx/langx | https://github.com/langx/langx/issues/1248 | 2026-09-09 | | | | FU 草稿 09-18 待发 |
| 9 | github/gh-aw | https://github.com/github/gh-aw/issues/59721 | 2026-09-09 | N | | | **CLOSED** by pelikhan（无评论）；AI Moderator 邮件可忽略 |
| 10 | RedHatInsights/insights-advisor-frontend | https://github.com/RedHatInsights/insights-advisor-frontend/issues/2231 | 2026-09-09 | | | | |
| 11 | michaelfaith/eslint-plugin-package-json | https://github.com/michaelfaith/eslint-plugin-package-json/issues/2172 | 2026-09-11 | N | | | **decline**；请以后用他们 issue 模板 |
| 12 | bennycode/trading-signals | https://github.com/bennycode/trading-signals/issues/1358 | 2026-09-11 | N | | | **CLOSED as spam** by @bennycode（2026-09-18）；**永不再 ping** |
| 13 | wKovacs64/pwned | https://github.com/wKovacs64/pwned/issues/412 | 2026-09-11 | | | | FU 已发 09-17；仅我方 soft；7d 已满≥09-24（无维护者回则勿连催） |
| 14 | Code-Hex/graphql-codegen-typescript-validation-schema | https://github.com/Code-Hex/graphql-codegen-typescript-validation-schema/issues/1572 | 2026-09-11 | | | | FU 草稿 09-18 待发（人审） |
| 15 | fedify-dev/hollo | https://github.com/fedify-dev/hollo/issues/611 | 2026-09-11 | | | | FU 已发 09-17；静音 |
| 16 | xxczaki/cashify | https://github.com/xxczaki/cashify/issues/109 | 2026-09-14 | | | | FU 已发 09-17；仅我方 soft；7d 已满≥09-24（无维护者回则勿连催） |
| 17 | JSPrismarine/JSPrismarine | https://github.com/JSPrismarine/JSPrismarine/issues/2504 | 2026-09-14 | | | | FU 草稿 09-18 待发 |
| 18 | kachkaev/njt | https://github.com/kachkaev/njt/issues/1312 | 2026-09-14 | | | | FU 已发 09-17；仅我方 soft；7d 已满≥09-24（无维护者回则勿连催） |
| 19 | npmx-dev/npmx.dev | https://github.com/npmx-dev/npmx.dev/issues/3254 | 2026-09-14 | | | | FU 草稿 09-23 pin `@v0.2.1`（Bot desk）；**人审后发** |
| 20 | appleple/SmartPhoto | https://github.com/appleple/SmartPhoto/issues/99 | 2026-09-14 | N | | | **CLOSED**（2026-09-17 scan；无维护者回复） |

**累计发出：** 20 · **G1（≥20）：✅ 达标** · 下一关注 G2（外仓安装≥3）  
**2026-09-17：** follow-up **已发** → cashify#109 · pwned#412 · njt#1312 · trading-signals#1358 · hollo#611  
**2026-09-18：** trading-signals **标 spam 关闭**；新 FU 草稿 → JSPrismarine#2504 · Code-Hex#1572 · langx#1248（人审后发）  
**2026-09-23 scan：** install_how/PathA/pin=**0**（OPEN Prefer+RedHat+watches）；cashify/pwned/njt 评论=仅 09-17 我方 soft  
**2026-09-23 explore：** FU 草稿 → npmx.dev#3254（`@v0.2.1`；Bot: `/workspace/desk/outputs/dep-followups-2026-09-23-pm.md`）  
**警告：** follow-up 易被当 spam → 放慢；7d 已满≠自动再 ping（无维护者活动则跳过）  

**选仓（2026-09-10 起收紧）：** 中小维护、Dependabot 活跃、工具栈未满；**少碰**大厂/已有完整 dependency workflow 的仓。见 [`docs/growth-github.md`](../docs/growth-github.md)。  
**常见拒：** `decline=workflow` / spam close → 仍计 G1，不计安装。  
**对外文案禁止：** 影响率数字、假客户、假社证。

## 草稿待审（GrokBot → 人）

| date | repo | why (3 lines) | draft ready? | human action |
| :--- | :--- | :--- | :--- | :--- |
| 2026-09-23 | npmx-dev/npmx.dev#3254 | OPEN 从未 soft；G2 explain-first；pin `@v0.2.1` | Y（Bot desk） | 人审后发 FU |
| 2026-09-18 | Code-Hex#1572 | OPEN；AM draft 待发 | Y | 人审后发 |
| 2026-09-18 | JSPrismarine#2504 · langx#1248 | OPEN；FU 草稿 | Y | 人审后发（可缓） |
