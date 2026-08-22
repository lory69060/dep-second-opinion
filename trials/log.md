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
| 11 | same | [#16](https://github.com/lory69060/dep-second-opinion-trial/pull/16) | github-actions / chore(deps) hallucinated pkg | HIGH_RISK | BLOCK | ok | n/a | n/a | v0.2.0 金丝雀；registry missing；未合入 | 2026-08-22 |

**主标签**：`ok` · `误报` · `漏报` · `半误` · `半漏` · `门禁对` · `漏帮助`  
**opened / influenced**：`Y` / `N` / `?`（merge ≥3 天后补）

## 中期汇总（6/10，非正式停做判定）

| 指标 | 值 | 对照健康带 |
| :--- | :- | :--- |
| 有效条 | 5（排除门禁对 #5） | |
| 误报率 | 0/5 = 0% | ≤20% |
| 漏报率 | 2/5 = 40% | ≤15%（样本未满 10，不判杀） |
| 门禁准确 | 1/1 = 100% | ≥80% |
| 影响率 | 未测（主动造样） | ≥30% |
| 留存 | 仍启用 @v0.2.0 | |
| 停做线 | **未触** | |

### 已暴露缺陷（下一步优先修）

- 有效条分母：按协议去掉「SKIP 且门禁对」的 #5；#10 为政策 ignore 的预期沉默，计 ok。
- 影响率 / opened 需真实 Dependabot 场景补；主动矩阵只验证信号准确度。
- Phase4 #11：幻觉包金丝雀在 `@v0.2.0` 下正确 `HIGH_RISK`；PR 关闭未合，避免污染 main。
