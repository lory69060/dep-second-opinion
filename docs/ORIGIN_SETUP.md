# Step 5 — 推到 Cursor Origin（需本机登录）

本地 Step 0–4 已验收。本步需要你在本机完成 Origin CLI 登录（会打开浏览器）。

## 命令

```bash
# 1) 安装 CLI
curl -fsSL https://downloads.cursor.com/origin/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"

# 2) 登录（浏览器授权 Cursor 账号；需付费计划且开启 Origin）
origin auth login
origin auth status

# 3) 在项目目录创建远端并推送
cd /Users/wangyifei/Projects/dep-second-opinion
origin repo create dep-second-opinion
git remote add origin "https://origin.cursor.com/$(origin repo list 2>/dev/null | head -1 | awk '{print $1}')/dep-second-opinion.git" 2>/dev/null || true
# 更稳妥：从 cursor.com/codebase 复制 HTTPS clone URL 后：
# git remote add origin https://origin.cursor.com/<owner>/dep-second-opinion.git
git add -A
git status
git commit -m "feat: npm dependency second-opinion CLI + Origin automation prompt"
git push -u origin HEAD

# 4) 挂 Automation
# 打开 https://cursor.com/automations
# Trigger: Pull request opened / pushed
# Prompt: 粘贴 automations/origin-pr-review.md 全文
```

## 验收标准

- [ ] `origin auth status` 显示已登录
- [ ] 远端仓可在 [cursor.com/codebase](https://cursor.com/codebase) 看到
- [ ] Automation 已保存并指向该仓
- [ ] 开一个改 `package.json` 的测试 PR，出现第二意见评论且**无代码改动**

完成后告诉我「Origin 已登录」，我继续帮你执行 create / push / 核对。
