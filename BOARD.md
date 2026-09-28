# Daily Plan 看板

> **最后更新：** 2026-09-28  
> **当前 release：** [`v0.2.1`](https://github.com/lory69060/dep-second-opinion/releases/tag/v0.2.1)  
> **一句话状态：** 楔子改为 **auto-merge companion + registry-missing**；Issue 喷量冻结；G2 杀线 **2026-10-12**

| 链接 | 用途 |
| :--- | :--- |
| [`PLAN.md`](./PLAN.md) | 完整路线图与验收标准 |
| [`trials/log.md`](./trials/log.md) | 逐条 PR 试验记录 |
| [`trials/retention.md`](./trials/retention.md) | 留存 / 影响率观察 |
| [`trials/issue-tracker.md`](./trials/issue-tracker.md) | Suggestion Issue 追踪（G1） |
| [`CHANGELOG.md`](./CHANGELOG.md) | 消费者版本说明 |
| [`docs/install.md`](./docs/install.md) | 安装 Path A / B |
| [`docs/what-it-does.md`](./docs/what-it-does.md) | 一句话科普（auto-merge companion） |
| [`docs/dependabot-auto-merge.md`](./docs/dependabot-auto-merge.md) | 与 Dependabot auto-merge 配对 + 截图清单 |
| [`docs/findings-schema.md`](./docs/findings-schema.md) | Findings schema v1 |
| [`docs/eval.md`](./docs/eval.md) | 发版评测门禁 |
| [`docs/growth-github.md`](./docs/growth-github.md) | GitHub 增长 SOP |
| [`docs/grokbot-standing.md`](./docs/grokbot-standing.md) | **GrokBot 任务卡 standing（含 TARGETING）** |
| [`docs/marketplace-readme-checklist.md`](./docs/marketplace-readme-checklist.md) | Marketplace 上架清单 |
| [`docs/marketplace-listing.md`](./docs/marketplace-listing.md) | Marketplace 提交文案草稿 |

---

## 今日焦点（2026-09-28）

| 优先级 | 任务 | 说明 |
| :---: | :--- | :--- |
| P0 | **Marketplace 人提交** | [`marketplace-listing.md`](./docs/marketplace-listing.md) 已按新楔子改 |
| P0 | **G2 杀线** | 至 **2026-10-12**：≥1 非自有仓 Path A + 机器人评论，或 Marketplace 可追踪安装 |
| P1 | **人审 FU ≤2** | 仅队列：npmx#3254 优先；Code-Hex#1572 次之；**不再扩名单** |
| P2 | **截图素材** | trial [PR#19](https://github.com/lory69060/dep-second-opinion-trial/pull/19) SAFE · [PR#16](https://github.com/lory69060/dep-second-opinion-trial/pull/16) HIGH_RISK；pin 已升 `@v0.2.1` |
---

## 看板

### ✅ 已完成

<details open>
<summary><strong>Phase 0–2 · 引擎</strong>（步骤 0–4）</summary>

- [x] 项目骨架、分析器、CLI、测试
- [x] Origin Automation prompt（演示壳，非主路径）
</details>

<details open>
<summary><strong>Phase 3 · 试验与分发</strong>（步骤 5–17）</summary>

- [x] GitHub Action 正式壳（`action.yml` + workflow）
- [x] 政策文件 `.dep-second-opinion.yml`
- [x] Tag `v0.1.0` → `v0.1.1`（修 auto_merge / HIGH_RISK 评论）
- [x] 试验协议 + 外仓 [dep-second-opinion-trial](https://github.com/lory69060/dep-second-opinion-trial)
- [x] 10/10 主动样本，误报/漏报 **0%**
- [x] 安装文档 Path A/B；仓 **public**
</details>

<details open>
<summary><strong>Phase 4 · 供应链信号</strong>（步骤 18）</summary>

- [x] `on_registry_missing` + `supply_chain.*`
- [x] Tag **`v0.2.0`**；金丝雀 PR#16 → `HIGH_RISK`
</details>

<details open>
<summary><strong>Phase 5 · 真实 Dependabot 闭环</strong>（步骤 19–22）</summary>

- [x] 5 条真实 Dependabot PR 入 log（#11–#15），verdict 全 ok
- [x] 关闭手动样例 PR #1–#10；Dependabot 须 Path A 文档
- [x] Pin/docs 一致 `@v0.2.0`；评论脚注版本号
- [x] 消费者 [`CHANGELOG.md`](./CHANGELOG.md)
</details>

---

### 🔄 进行中

| 项 | 截止 | 进度 | 下一步 |
| :--- | :--- | :--- | :--- |
| **Phase 6 · 楔子 + 获客换道** | **2026-10-12** | 喷量冻结；Marketplace + 人审队列 | 见下方杀线 |
| **加强版 · G1→G2** | 杀线并入 Phase 6 | **G1 ✅** · **G2 = 0** | 禁止新 Issue 喷量 |
| **步骤 15 · 留存 T1** | 已过窗 | 影响率 75%（含代填） | 不阻塞 |

---

### 📋 待办（可选，不阻塞 T1）

| ID | 任务 | 预估 | 备注 |
| :---: | :--- | :--- | :--- |
| 5.4a | Marketplace 提交（按 checklist） | 人 | **P0**；listing 已对齐 auto-merge 楔子 |
| 5.4b | Tag **`v0.2.1`** | ✅ | 已发 2026-09-23 |
| — | 试验仓 Dependabot #11/#13–#15 处置 | — | 开着或关均可；verdict 已记 |
| — | Draft 审查 PR [#2–#6](https://github.com/lory69060/dep-second-opinion/pulls) | — | 历史拆分，勿合入 main |

---

### ⏸ 等待中（日历驱动）

| 日期 | 事件 | 动作 |
| :--- | :--- | :--- |
| **2026-08-25** | PR#12 merge +3 天 | ✅ 2026-08-27 已填 log #13 |
| **2026-09-04** | T1 留存窗口结束 | 填 `trials/retention.md` T1 行；算影响率/留存 |
| **2026-10-12** | Phase 6 杀线 | 见下节；未达标则停外推 |

---

## Phase 6 杀线（2026-09-28 → 2026-10-12）

**达标（任一）：** ≥1 个**非自有**仓 Path A 安装且跑出机器人评论；**或** Marketplace 上架后出现可追踪安装线索。达标后再开下一产品小步。

**未达标：** 停止一切外推；项目降级为自用 dogfood + 开源归档节奏；**不再投入 GrokBot 日卡**。

GrokBot：默认 **scan-only**。Creem 仍冻结。

---

### 🚫 明确不做（当前阶段）

- GitHub App（非 Marketplace Action 上架）
- 自动改 `package.json` / lockfile
- Creem/付费（G3 留存门前）
- drive-by workflow PR / 假指标
- 行为分析 / install-script 沙箱 / 付费威胁情报 / 多生态 / LLM Why
- Issue 喷量、X 冷推、「替代 Socket/Snyk」叙事

---

## 里程碑时间线

```
2026-08-21  T0 试验开窗 · v0.1.1 · 10/10 样本
     │
2026-08-22  v0.2.0 · Dependabot 真 PR · PR#12 合入
     │
2026-08-26  Phase 5.3 CHANGELOG ✅
     │
2026-08-27  BOARD 看板合入 · PR#12/#11 影响率 · 增样本配置 ✅  ← 今天
     │
2026-09-04  T1 留存截止 ─────────────► 填 retention + 影响率汇总
     │
2026-09-23  v0.2.1 · findings/delta
     │
2026-09-28  Phase 6 楔子对齐 · 喷量冻结
     │
2026-10-12  G2/安装杀线 ─────────────► 达标续做 / 未达标停外推
```

---

## 指标快照

| 指标 | 当前值 | 健康带 | 状态 |
| :--- | :--- | :--- | :--- |
| 试验条数 | 16（10 主动 + 1 金丝雀 + 5 Dependabot） | ≥10 | ✅ |
| 误报率 | 0% | ≤20% | ✅ |
| 漏报率 | 0% | ≤15% | ✅ |
| 门禁准确 | 100% | ≥80% | ✅ |
| 影响率 | **75%**（4/4 Dependabot 已合且已填） | ≥30% | ✅ |
| 留存 | T0=Y | 9/4 仍启用 | 🔄 |
| G2 外仓安装 | **0** | ≥1 by 2026-10-12 | 🔄 杀线 |
| 停做线 | **未触发**（试验协议） | Phase 6 杀线 10-12 | 🔄 |

---

## 每日更新约定

1. 改完一步 → 更新本文件「最后更新」+ 移动看板卡片 + 同步 [`PLAN.md`](./PLAN.md) 验收表
2. 有新试验 PR → 追加 [`trials/log.md`](./trials/log.md)
3. merge ≥3 天 → 补 log 的 `opened` / `influenced`
4. 打新 tag → 更新 CHANGELOG + 本文件 release 行

---

## 试验 / dogfood 速查

| 仓 | Pin | 状态 |
| :--- | :--- | :--- |
| [dep-second-opinion-trial](https://github.com/lory69060/dep-second-opinion-trial)（private） | `@v0.2.1` Path A | **2026-09-28 已升 pin** |
| [dep-second-opinion-dogfood](https://github.com/lory69060/dep-second-opinion-dogfood)（public） | `@v0.2.1` Path A | **2026-09-28 已升 pin** |
| 开着 PR（trial） | #13–#15、#20–#21（5 条） | REVIEW/HIGH_RISK，未合 |
| 已合（trial） | #12 · #11 · #18 · #19 | 4 条；影响率 75% |
