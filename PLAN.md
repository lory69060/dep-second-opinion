# 依赖 PR「第二意见」× Cursor Origin — 执行计划

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

## 验收记录

| 步骤 | 状态 | 证据 |
| :--- | :--- | :--- |
| 0 | ✅ | `PLAN.md` / `package.json` / `src/` / `fixtures/` / `automations/` |
| 1 | ✅ | `src/analyze.ts` + offline/online 评审 JSON/Markdown |
| 2 | ✅ | `OFFLINE=1 ./run.sh no-change\|npm-major\|npm-minor` 均通过 |
| 3 | ✅ | `automations/origin-pr-review.md` 含 HARD RULES 禁改代码 |
| 4 | ✅ | `node --test`：7 passed, 0 failed |
| 5 | ✅ 仓已推送 | `zhu-xiaowei/dep-second-opinion` → Origin；Automation 待在编辑器里点保存 |
