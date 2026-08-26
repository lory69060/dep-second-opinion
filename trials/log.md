# 试验记录（按 PLAN「试验协议」填）

Pin：`lory69060/dep-second-opinion@v0.2.0`（Phase 4 起）  
试验仓：`lory69060/dep-second-opinion-trial`  
窗口：2026-08-21 → 2026-08-21（主动凑满 **10/10**）；Phase4 金丝雀 2026-08-22

| # | 仓 | PR | bot actor/title | actual | expected | 主标签 | opened | influenced | 备注 | 日期 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| 1 | dep-second-opinion-trial | [#1](https://github.com/lory69060/dep-second-opinion-trial/pull/1) | github-actions / chalk major | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | prod major | 2026-08-21 |
| 2 | same | [#2](https://github.com/lory69060/dep-second-opinion-trial/pull/2) | github-actions / ms patch | SAFE_TO_MERGE | SAFE | ok | ? | ? | prod patch | 2026-08-21 |
| 3 | same | [#3](https://github.com/lory69060/dep-second-opinion-trial/pull/3) | github-actions / debug minor | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | v0.1.1 复验 | 2026-08-21 |
| 4 | same | [#4](https://github.com/lory69060/dep-second-opinion-trial/pull/4) | github-actions / typescript major | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | dev major | 2026-08-21 |
| 5 | same | [#5](https://github.com/lory69060/dep-second-opinion-trial/pull/5) | github-actions / feat mixed | NO_COMMENT | SKIP | 门禁对 | ? | ? | 混杂 PR | 2026-08-21 |
| 6 | same | [#6](https://github.com/lory69060/dep-second-opinion-trial/pull/6) | github-actions / request deprecated | HIGH_RISK | BLOCK | ok | ? | ? | v0.1.1 复验 | 2026-08-21 |
| 7 | same | [#7](https://github.com/lory69060/dep-second-opinion-trial/pull/7) | github-actions / @types/node minor | SAFE_TO_MERGE | SAFE | ok | ? | ? | dev minor within auto_merge | 2026-08-21 |
| 8 | same | [#8](https://github.com/lory69060/dep-second-opinion-trial/pull/8) | github-actions / left-pad minor | HIGH_RISK | BLOCK | ok | ? | ? | npm deprecated → on_deprecated（初预期 REVIEW，按信号改 expected） | 2026-08-21 |
| 9 | same | [#9](https://github.com/lory69060/dep-second-opinion-trial/pull/9) | github-actions / debug+ms | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | multi：minor 抬级 | 2026-08-21 |
| 10 | same | [#10](https://github.com/lory69060/dep-second-opinion-trial/pull/10) | github-actions / left-pad ignored | NO_COMMENT | SKIP | ok | ? | ? | policy ignore；日志 not posting | 2026-08-21 |
| 11 | same | [#16](https://github.com/lory69060/dep-second-opinion-trial/pull/16) | github-actions / hallucinated pkg | HIGH_RISK | BLOCK | ok | n/a | n/a | v0.2.0 金丝雀；未合入 | 2026-08-22 |
| 12 | same | [#11](https://github.com/lory69060/dep-second-opinion-trial/pull/11) | dependabot / bump debug minor | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | **真实 Dependabot**；prod minor | 2026-08-22 |
| 13 | same | [#12](https://github.com/lory69060/dep-second-opinion-trial/pull/12) | dependabot / bump ms patch | SAFE_TO_MERGE | SAFE | ok | ? | ? | **真实 Dependabot**；prod patch；**已合** 2026-08-22（影响率 ≥3 天后补） | 2026-08-22 |
| 14 | same | [#13](https://github.com/lory69060/dep-second-opinion-trial/pull/13) | dependabot / bump chalk major | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | **真实 Dependabot**；prod major | 2026-08-22 |
| 15 | same | [#14](https://github.com/lory69060/dep-second-opinion-trial/pull/14) | dependabot / bump typescript major | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | **真实 Dependabot**；dev major | 2026-08-22 |
| 16 | same | [#15](https://github.com/lory69060/dep-second-opinion-trial/pull/15) | dependabot / bump @types/node major | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | **真实 Dependabot**；dev major | 2026-08-22 |

**主标签**：`ok` · `误报` · `漏报` · `半误` · `半漏` · `门禁对` · `漏帮助`  
**opened / influenced**：`Y` / `N` / `?`（merge ≥3 天后补）

## 汇总

### 主动矩阵（#1–#10）

| 指标 | 值 | 对照健康带 |
| :--- | :- | :--- |
| 有效条 | 8 | |
| 误报率 | 0% | ≤20% |
| 漏报率 | 0% | ≤15% |
| 门禁准确 | 100% | ≥80% |
| 影响率 | 未测 | ≥30% |
| 停做线 | **未触** | |

### Dependabot 真 PR（#12–#16 表行 / GH #11–#15）

| 指标 | 值 |
| :--- | :- |
| 条数 | 5；主标签全 ok |
| 影响率 | 待 merge ≥3 天后填 |
| 备注 | 曾因 Path B + Dependabot 读不到 secret 整批红；改 Path A 后复跑全绿 |
