# 试验记录（按 PLAN「试验协议」填）

Pin：`lory69060/dep-second-opinion@v0.1.1`（外仓经 `DEP_REVIEW_READ` checkout）
试验仓：`lory69060/dep-second-opinion-trial`  
窗口：2026-08-21 → ____（主动样本 6/10；#3/#6 已用 v0.1.1 复验）

| # | 仓 | PR | bot actor/title | actual | expected | 主标签 | opened | influenced | 备注 | 日期 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| 1 | dep-second-opinion-trial | [#1](https://github.com/lory69060/dep-second-opinion-trial/pull/1) | github-actions / Bump chalk 4→5 | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | prod major | 2026-08-21 |
| 2 | same | [#2](https://github.com/lory69060/dep-second-opinion-trial/pull/2) | github-actions / Bump ms patch | SAFE_TO_MERGE | SAFE | ok | ? | ? | prod patch | 2026-08-21 |
| 3 | same | [#3](https://github.com/lory69060/dep-second-opinion-trial/pull/3) | github-actions / Bump debug minor | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | v0.1.1 复验：exceeds auto_merge_max_bump=patch（初测漏报已修） | 2026-08-21 |
| 4 | same | [#4](https://github.com/lory69060/dep-second-opinion-trial/pull/4) | github-actions / Bump typescript major | REVIEW_RECOMMENDED | REVIEW | ok | ? | ? | dev major | 2026-08-21 |
| 5 | same | [#5](https://github.com/lory69060/dep-second-opinion-trial/pull/5) | github-actions / feat mixed | NO_COMMENT | SKIP | 门禁对 | ? | ? | 混杂 PR；日志 `Verdict NO_COMMENT; not posting` | 2026-08-21 |
| 6 | same | [#6](https://github.com/lory69060/dep-second-opinion-trial/pull/6) | github-actions / Bump request deprecated | HIGH_RISK | BLOCK | ok | ? | ? | v0.1.1 复验：评论已发且 Action 绿（初测 exit2 未发帖已修） | 2026-08-21 |
| 7 | | | | | | | | | | |
| 8 | | | | | | | | | | |
| 9 | | | | | | | | | | |
| 10 | | | | | | | | | | |

**主标签**：`ok` · `误报` · `漏报` · `半误` · `半漏` · `门禁对` · `漏帮助`  
**opened / influenced**：`Y` / `N` / `?`（merge ≥3 天后补）

## 中期汇总（6/10，v0.1.1 复验后）

| 指标 | 值 | 对照健康带 |
| :--- | :- | :--- |
| 有效条 | 5（排除门禁对 #5） | |
| 误报率 | 0/5 = 0% | ≤20% |
| 漏报率 | 0/5 = 0%（初测 40%，已修） | ≤15% |
| 门禁准确 | 1/1 = 100% | ≥80% |
| 影响率 | 未测 | ≥30% |
| 留存 | 仍启用（pin → v0.1.1） | |
| 停做线 | 未触 | |

### 已修复缺陷

1. ~~`auto_merge_max_bump` 未强制~~ → v0.1.1 超限抬 `REVIEW`
2. ~~`HIGH_RISK` 把 Action 打挂~~ → 仍发评论且 job 绿
