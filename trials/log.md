# 试验记录（按 PLAN「试验协议」填）

Pin：`lory69060/dep-second-opinion@v0.1.0`（外仓经 `DEP_REVIEW_READ` checkout）  
试验仓：`lory69060/dep-second-opinion-trial`  
窗口：2026-08-21 → ____（主动样本进行中，6/10）

| # | 仓 | PR | bot actor/title | actual | expected | 主标签 | opened | influenced | 备注 | 日期 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| 1 | dep-second-opinion-trial | [#1](https://github.com/lory69060/dep-second-opinion-trial/pull/1) | github-actions / Bump chalk 4→5 | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | prod major | 2026-08-21 |
| 2 | same | [#2](https://github.com/lory69060/dep-second-opinion-trial/pull/2) | github-actions / Bump ms patch | SAFE_TO_MERGE | SAFE | ok | ? | ? | prod patch | 2026-08-21 |
| 3 | same | [#3](https://github.com/lory69060/dep-second-opinion-trial/pull/3) | github-actions / Bump debug minor | SAFE_TO_MERGE | REVIEW | 漏报 | ? | ? | policy `auto_merge_max_bump=patch` 未把 prod minor 抬到 REVIEW；score=18 | 2026-08-21 |
| 4 | same | [#4](https://github.com/lory69060/dep-second-opinion-trial/pull/4) | github-actions / Bump typescript major | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | dev major | 2026-08-21 |
| 5 | same | [#5](https://github.com/lory69060/dep-second-opinion-trial/pull/5) | github-actions / feat mixed | NO_COMMENT | SKIP | 门禁对 | ? | ? | 混杂 PR；日志 `Verdict NO_COMMENT; not posting` | 2026-08-21 |
| 6 | same | [#6](https://github.com/lory69060/dep-second-opinion-trial/pull/6) | (无评论) / Bump request deprecated | (无帖；job exit 2) | BLOCK | 漏报 | ? | ? | CLI `HIGH_RISK`→exit 2 + `set -e`，评论未发出；Action fail | 2026-08-21 |
| 7 | | | | | | | | | | |
| 8 | | | | | | | | | | |
| 9 | | | | | | | | | | |
| 10 | | | | | | | | | | |

**主标签**：`ok` · `误报` · `漏报` · `半误` · `半漏` · `门禁对` · `漏帮助`  
**opened / influenced**：`Y` / `N` / `?`（merge ≥3 天后补）

## 中期汇总（6/10，非正式停做判定）

| 指标 | 值 | 对照健康带 |
| :--- | :- | :--- |
| 有效条 | 5（排除门禁对 #5） | |
| 误报率 | 0/5 = 0% | ≤20% |
| 漏报率 | 2/5 = 40% | ≤15%（样本未满 10，不判杀） |
| 门禁准确 | 1/1 = 100% | ≥80% |
| 影响率 | 未测 | ≥30% |
| 留存 | 仍启用 | |
| 停做线 | 未正式命中（样本&lt;10）；**预警**：漏报偏高 | |

### 已暴露缺陷（下一步优先修）

1. **`auto_merge_max_bump` 未强制**：prod minor 在 max=patch 时仍可 `SAFE_TO_MERGE`（#3）
2. **`HIGH_RISK` 把 Action 打挂**：`cli` exit 2 + script `set -e`，评论发不出（#6）
