# 留存 / 影响率观察（Phase 3.5）

## T0 基线（2026-08-21）

| 项 | 值 |
| :--- | :--- |
| 试验仓 | [lory69060/dep-second-opinion-trial](https://github.com/lory69060/dep-second-opinion-trial) |
| Action | 仍启用；pin `v0.1.1`（`DEP_REVIEW_READ` checkout） |
| 信号矩阵 | 10/10 已记；误报/漏报 0%（见 `log.md`） |
| Dependabot | 本步启用（见仓内 `.github/dependabot.yml`） |
| 观察窗结束 | **2026-09-04**（T0 + 14 天） |

## 怎么填

### 留存（窗口结束日填一次）

| 日期 | Action 仍启用？ | pin 仍为 v0.1.x？ | 备注 |
| :--- | :--- | :--- | :--- |
| 2026-08-21 T0 | Y | v0.1.1 | |
| 2026-09-04 T1 | | | 卸装 / 改 pin / 关掉 workflow → 留存失败 |

### 影响率（仅 **Dependabot/Renovate 真实 PR**；主动造样不计入）

在 `log.md` 追加行，`opened` / `influenced` 在 merge **≥3 天后**填：

- `opened`：是否点开过 bot 评论（Y/N/?）
- `influenced`：是否因此推迟 merge / 加测 / 关掉 PR（Y/N/?）

**影响率** = influenced=Y / 这些真实 PR 有效条。健康带 ≥30%；&lt;10% 触停做线。

## 本步验收（可立即完成的部分）

- [x] T0 基线写入本文件
- [x] 试验仓启用 Dependabot（等真实 PR）
- [ ] T1（2026-09-04）填留存
- [ ] ≥1 条真实 Dependabot PR 填 opened/influenced
