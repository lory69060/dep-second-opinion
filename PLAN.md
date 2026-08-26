# 依赖 PR「第二意见」× Cursor Origin — 执行计划

> **进度看板（每日）：** [`BOARD.md`](./BOARD.md)

## 目标

做一个 **opt-in、只评论不改代码** 的依赖升级评审器：

1. 本地可对 lockfile / package 变更跑出结构化评审（可测）
2. 提供 Origin Automation Prompt，挂到 PR 事件上由 Cloud Agent 执行同一套规则
3. 核心分析器开源；Origin 作为第一分发通道

## 硬约束

- 禁止自动修改 `package.json` / lockfile 并 push
- 低置信度输出 `NO_COMMENT`，宁可不说话
- 不以「下载量骤降」作为主风险信号
- 一步一验收，不跳过

## 步骤与验收

| 步骤 | 内容 | 验收标准 |
| :--- | :--- | :--- |
| **0** | 项目骨架 + 本计划 | 仓内有 `PLAN.md`、`package.json`、目录结构 |
| **1** | 核心分析器 | 给定 fixture diff → 输出 JSON 评审（含 verdict / reasons / sources） |
| **2** | 本地 CLI | `./run.sh fixtures/npm-minor` 打印 Markdown 评论且 exit 0 |
| **3** | Origin Automation Prompt | `automations/origin-pr-review.md` 含禁改代码 + 调用 CLI 说明 |
| **4** | 自动测试 | `pnpm test` / `npm test` 覆盖：安全升级 / 已知漏洞 / 无依赖变更→NO_COMMENT |
| **5** | Origin 托管 | `origin` 登录成功后 `repo create` + push；文档写明 Automation 挂载步骤 |

## 本轮范围（先做完 0–4，5 需你登录 Origin）

- 生态先支持 **npm**（`package.json` 前后对比）
- 信号：版本跨度（major/minor/patch）+ OSV 漏洞查询 + npm 包元数据（可选网络）
- 不做：GitHub App、自动换包 PR、Stripe、全网扫描

## 托管策略（2026-08-21）

- **正式壳（对外）**：**GitHub Actions** → 评论作者 `github-actions[bot]`，邮件是 GitHub 通知（非 Cursor 标题）。
- **演示壳**：[Cursor Automation](https://github.com/lory69060/dep-second-opinion/pull/1) 已验证可跑，仅作内部 demo。
- **Origin** `zhu-xiaowei/dep-second-opinion`：备份；Automation 触发暂不作为主路径。
- **引擎**：同一套 `dep-review` CLI（Action / CLI / 可选 Automation 共用）。

## 验收记录

| 步骤 | 状态 | 证据 |
| :--- | :--- | :--- |
| 0 | ✅ | `PLAN.md` / `package.json` / `src/` / `fixtures/` / `automations/` |
| 1 | ✅ | `src/analyze.ts` + offline/online 评审 JSON/Markdown |
| 2 | ✅ | `OFFLINE=1 ./run.sh no-change\|npm-major\|npm-minor` 均通过 |
| 3 | ✅ | `automations/origin-pr-review.md` 含 HARD RULES 禁改代码 |
| 4 | ✅ | `node --test`：7 passed, 0 failed |
| 5 | ✅ 仓已推送 | `zhu-xiaowei/dep-second-opinion` → Origin |
| 6 E2E | ✅ GitHub Automation demo | [GH PR #1](https://github.com/lory69060/dep-second-opinion/pull/1) Cursor Automation 评论 `REVIEW_RECOMMENDED` |
| 7 换壳 | ✅ GitHub Action | `.github/workflows/dep-second-opinion.yml` + `scripts/github-pr-review.sh` + `action.yml` |
| 8 Phase1 | ✅ 做深 | 评论含 Why/Evidence；prod/dev 分策；Dependabot/Renovate/门禁（`pr-gate`） |
| 9 Phase2 | ✅ 政策文件 | `.dep-second-opinion.yml` 可配置 auto_merge / major / osv / ignore |
| 10 Phase3.0 | ✅ Action 可 pin | 打 `v0.1.0`；README 推荐 `uses: …@v0.1.0`（非 `@main`） |
| 11 Phase3.1 | ✅ 试验协议 | 见下方「试验协议」；记录表 `trials/log.md` |
| 12 Phase3.2 | ✅ 真实仓试验 | 外仓 [dep-second-opinion-trial](https://github.com/lory69060/dep-second-opinion-trial) 已挂 `@v0.1.0`；[PR #1](https://github.com/lory69060/dep-second-opinion-trial/pull/1) → `REVIEW_RECOMMENDED`；log #1 |
| 13 Phase3.3 | ✅ 凑样本 | 10/10；汇总误报/漏报 0%；见 `trials/log.md` |
| 14 Phase3.4 | ✅ 修试验暴露缺陷 | `auto_merge` 超限→REVIEW；HIGH_RISK 发评论且 Action 绿；tag `v0.1.1` |
| 15 Phase3.5 | 🔄 留存/影响率 | T0 + Dependabot 已就位；窗至 **2026-09-04**；见 `trials/retention.md` |
| 16 Phase3.6 | ✅ 安装文档 | [`docs/install.md`](./docs/install.md) Path A/B；README 链到安装页 |
| 17 Phase3.7 | ✅ 公开 Action | 仓 **public**；Path A 优先；试验仓 main 已 `uses: …@v0.1.1`；PR#2 Path A 复验通过 |
| 18 Phase4.0 | ✅ AI/供应链信号 | `on_registry_missing` + `supply_chain`；fixture `npm-hallucinated`；tag **`v0.2.0`**；试验仓 [PR#16](https://github.com/lory69060/dep-second-opinion-trial/pull/16) 金丝雀 `HIGH_RISK`；[PR#17](https://github.com/lory69060/dep-second-opinion-trial/pull/17) pin 合入 |
| 19 Phase5.0 | ✅ 真实 Dependabot 入 log | 试验仓 PR #11–#15（Dependabot）Verdict 已记；见 `trials/log.md` #12–#16 |
| 20 Phase5.1 | ✅ 试验仓清理 + Dependabot 文档 | 关闭已记入手动样例 PR #1–#10；install 注明 Dependabot 须 Path A |
| 21 Phase5.2 | ✅ Pin/docs 一致 | README/install `@v0.2.0`；评论脚注 `v0.2.0`；本仓 workflow 注明 dogfood vs 外仓 pin |
| 22 Phase5.3 | ✅ 消费者 CHANGELOG | [`CHANGELOG.md`](./CHANGELOG.md)：`v0.1.1`→`v0.2.0` 行为/政策说明；`[Unreleased]` 含 5.2 脚注；README 链接 |

## Phase 5 — 真实依赖机器人闭环（2026-08-22）

- **不做**：GitHub App 品牌号、Marketplace 上架、第二生态（PyPI 等）
- **做**：Dependabot 真 PR 入表；SAFE 合入开影响率计时；试验仓卫生；pin/docs 与 `v0.2.0` 一致；消费者变更日志
- 步骤 19–22 已验收。下一步：步骤 15 T1（9/4）；或 Phase5.4 Marketplace README / 打 `v0.2.1` 含脚注

## Phase 4 — AI / 供应链加深（2026-08-22）

- **不做**：托管沙箱、自动改依赖、语义影响图
- **做**：npm 404 / 版本未发布 → 默认 `HIGH_RISK`；新增依赖过新 → 默认 `REVIEW`
- 政策键：`on_registry_missing`、`supply_chain.*`（见 `.dep-second-opinion.yml`）
- 版本意向：`v0.2.0`（404 从「无信号」变为硬门禁，对消费方为行为变更）

## Phase 3 原则

- 仍只评论、不改依赖
- 杀伤标准：见试验协议「停做线」
- 步骤 22（Phase5.3）已验收。步骤 15 的 T1/影响率：窗至 **2026-09-04**

## 试验协议（Phase 3.1）

### 范围

| 项 | 约定 |
| :--- | :--- |
| 对象仓 | 自有 npm 仓；挂 `lory69060/dep-second-opinion@v0.2.0`（Path A） |
| PR 类型 | Dependabot / Renovate / 标题含 bump·update 的依赖 PR；混杂功能 PR 应被门禁跳过 |
| 样本量 | 先 **10 条** 依赖 PR（可跨仓累计）；不足 10 条不判杀 |
| 窗口 | 挂上后 **14 天**，或凑满 10 条先到为准 |
| 对照 | 人工 merge 决定（或事后是否 revert / 紧急回滚） |

### Verdict 对错怎么记

人工在 merge 前给一个「应有标签」`expected`（只选一个）：

| expected | 含义 |
| :--- | :--- |
| `SAFE` | 可直接合，无需人审细节 |
| `REVIEW` | 应停下来看（major / 行为变更 / 不确定） |
| `BLOCK` | 不应合（已知洞、废弃、破坏性） |
| `SKIP` | 不应评论（非依赖 PR / 门禁应沉默） |

再对照 bot 的 `actual`（评论里的 Verdict；无评论或仅 `NO_COMMENT` 记 `NO_COMMENT`）：

| actual \ expected | SAFE | REVIEW | BLOCK | SKIP |
| :--- | :--- | :--- | :--- | :--- |
| `SAFE_TO_MERGE` | ✅ 真阴性 | **漏报** | **漏报** | 误扰 |
| `REVIEW_RECOMMENDED` | **误报** | ✅ | 偏松（记半漏） | 误扰 |
| `HIGH_RISK` | **误报** | 偏严（记半误） | ✅ | 误扰 |
| `NO_COMMENT` / 无帖 | 漏帮助* | **漏报** | **漏报** | ✅ 门禁对 |

\*「漏帮助」：人本来想快速合，bot 没给 SAFE——不进误报率，单独计「沉默率」。

**计数（每条 PR 一行，互斥主标签）：**

- **误报** = bot 比人工更严，且阻碍/干扰了本可 SAFE 的合并（含把 SAFE 打成 REVIEW/HIGH_RISK）
- **漏报** = bot 比人工更松，或该喊没喊（BLOCK/REVIEW → SAFE / NO_COMMENT）
- **半误 / 半漏** = REVIEW↔HIGH_RISK 错位；汇总时各计 0.5
- **门禁正确** = expected=SKIP 且 NO_COMMENT/无帖

### 留存怎么记

每条 PR 在 merge 后 **≥3 天** 再填：

| 字段 | 怎么填 |
| :--- | :--- |
| `human_opened_comment` | 是否点开过 bot 评论（自己回忆 / 是否回复过）Y/N/未知 |
| `influenced_merge` | 评论是否改变了 merge/等一等/加测？Y/N/未知 |
| `revisit` | 14 天窗口内是否又回来改 policy / 再开同类 PR 时仍启用 Action？Y/N |

**留存率** = 窗口结束时「仓上 Action 仍启用」的仓数 / 试验仓数。  
单仓试验时：若 14 天内关掉 workflow 或 pin 去掉 → 留存失败。

### 汇总指标（满 10 条后算）

| 指标 | 公式 | 健康带 |
| :--- | :--- | :--- |
| 误报率 | 误报 / 有效条* | ≤ 20% |
| 漏报率 | 漏报 / 有效条 | ≤ 15% |
| 门禁准确 | 门禁正确 / SKIP 条 | ≥ 80%（若有 SKIP） |
| 影响率 | influenced_merge=Y / 有效条 | ≥ 30%（过低=没人看） |
| 留存 | 见上 | 试验仓仍启用 |

\*有效条 = 总条 − expected=SKIP 且门禁正确的条（分母不算「本该沉默且沉默对了」）。

### 停做线（命中任一条 → 停扩、先改引擎或杀）

1. 误报率 **> 35%**，或连续 5 条 SAFE 被打成 REVIEW/HIGH_RISK  
2. 漏报率 **> 25%**，或任一条 BLOCK 被打成 SAFE_TO_MERGE  
3. 影响率 **< 10%** 且打开率明显低（评论没人看）  
4. 14 天内卸掉 Action（留存失败）且无「信号不准」以外的外部原因

### 记录表

逐条写入 [`trials/log.md`](./trials/log.md)。步骤 12 开始填实数据。