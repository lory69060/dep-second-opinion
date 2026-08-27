# Daily Plan 看板

> **最后更新：** 2026-08-27  
> **当前 release：** [`v0.2.0`](https://github.com/lory69060/dep-second-opinion/releases/tag/v0.2.0) · main `@59e2463`  
> **一句话状态：** 引擎 + Action 已可用；正在等试验留存窗口（T1 **2026-09-04**）

| 链接 | 用途 |
| :--- | :--- |
| [`PLAN.md`](./PLAN.md) | 完整路线图与验收标准 |
| [`trials/log.md`](./trials/log.md) | 逐条 PR 试验记录 |
| [`trials/retention.md`](./trials/retention.md) | 留存 / 影响率观察 |
| [`CHANGELOG.md`](./CHANGELOG.md) | 消费者版本说明 |
| [`docs/install.md`](./docs/install.md) | 安装 Path A / B |

---

## 今日焦点（2026-08-27）

| 优先级 | 任务 | 说明 |
| :---: | :--- | :--- |
| ✅ | 合并 PR [#7](https://github.com/lory69060/dep-second-opinion/pull/7) | `BOARD.md` 看板已进 main |
| ✅ | 增样本 | 合 trial PR#11；dependabot daily + 3 新依赖 |
| — | **无阻塞开发项** | 主路径等 T1 |
| P3 | Phase 5.4（可选） | Marketplace README 或打 `v0.2.1` |

**距离 T1 留存截止：** 8 天（2026-09-04）

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
| **步骤 15 · 留存/影响率 T1** | 2026-09-04 | 影响率 **50%**（2/2 已填） | 等新 Dependabot PR 合入；9/4 填留存 |

---

### 📋 待办（可选，不阻塞 T1）

| ID | 任务 | 预估 | 备注 |
| :---: | :--- | :--- | :--- |
| 5.4a | Marketplace README（badges + 价值主张） | 0.5d | Phase 5 下一步 |
| 5.4b | 打 tag **`v0.2.1`**（含评论脚注） | 0.5d | CHANGELOG `[Unreleased]` 已有说明 |
| — | 试验仓 Dependabot #11/#13–#15 处置 | — | 开着或关均可；verdict 已记 |
| — | Draft 审查 PR [#2–#6](https://github.com/lory69060/dep-second-opinion/pulls) | — | 历史拆分，勿合入 main |

---

### ⏸ 等待中（日历驱动）

| 日期 | 事件 | 动作 |
| :--- | :--- | :--- |
| **2026-08-25** | PR#12 merge +3 天 | ✅ 2026-08-27 已填 log #13 |
| **2026-09-04** | T1 留存窗口结束 | 填 `trials/retention.md` T1 行；算影响率/留存 |
| 9/4 后 | 根据指标决策 | 未触停做线 → Phase 6 或对外推广；触线 → 改引擎 |

---

### 🚫 明确不做（当前阶段）

- GitHub App / Marketplace **上架**
- 自动改 `package.json` / lockfile
- Stripe / 付费
- PyPI 等第二生态
- Cursor 插件形态（卖非 Cursor 团队）

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
     ?       Phase 5.4 / 6.x（待定）
```

---

## 指标快照

| 指标 | 当前值 | 健康带 | 状态 |
| :--- | :--- | :--- | :--- |
| 试验条数 | 16（10 主动 + 1 金丝雀 + 5 Dependabot） | ≥10 | ✅ |
| 误报率 | 0% | ≤20% | ✅ |
| 漏报率 | 0% | ≤15% | ✅ |
| 门禁准确 | 100% | ≥80% | ✅ |
| 影响率 | **50%**（2/2 Dependabot 已合且已填） | ≥30% | ✅ |
| 留存 | T0=Y | 9/4 仍启用 | 🔄 |
| 停做线 | **未触发** | — | ✅ |

---

## 每日更新约定

1. 改完一步 → 更新本文件「最后更新」+ 移动看板卡片 + 同步 [`PLAN.md`](./PLAN.md) 验收表
2. 有新试验 PR → 追加 [`trials/log.md`](./trials/log.md)
3. merge ≥3 天 → 补 log 的 `opened` / `influenced`
4. 打新 tag → 更新 CHANGELOG + 本文件 release 行

---

## 试验仓速查

| 仓 | Pin | 状态 |
| :--- | :--- | :--- |
| [dep-second-opinion-trial](https://github.com/lory69060/dep-second-opinion-trial) | `@v0.2.0` Path A | Action 启用 |
| 开着 PR | #13–#15、#18–#21（7 条） | REVIEW/HIGH_RISK，未合 |
| 已合 | #12 ms patch · #11 debug minor | #12 influenced=N · #11 influenced=Y |
