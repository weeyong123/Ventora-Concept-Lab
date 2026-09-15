# Homepage Concept Lab 概念目录

| 概念 | 永久访问路径 | 状态 |
| --- | --- | --- |
| 首个互动网站 / NOEMA | `/` | 已收录 |
| Luxury Coach | `/coach` | 已收录 |
| Construction Architecture | `/construction` | 已收录 |
| Spatial AI SaaS | `/saas` | 已收录 |
| LeadsTou Spatial AI Concept | `/leadstou-concept` | 已收录 |
| LeadsTou Homepage | `/leadstou` | 本地工作版本，未包含在 Demo 5 发布中 |
| Demo 6 — Johor Property Advisor | `/property-advisor` | Local concept / ready for review |
| **Demo 5 — Followthrough AI Device Concept** | **`/followthrough`** | **FROZEN / PRESERVED** |

## Demo 6 — Johor Property Advisor

- Permanent route: `/property-advisor`.
- VENTORA / MOTION STUDIES 06 — JOHOR PROPERTY ADVISOR.
- Fictional Jason Lim brand; seven editorial scenes, responsive GSAP motion, interactive district map, buyer intents, property selection and client journey.
- Independent component and styles: `src/PropertyAdvisor.jsx`, `src/PropertyAdvisor.css`. Assets: `public/property-advisor/`.
- Concept imagery and illustrative selections, not active listings. Contact opens a demo enquiry; no live advisor number is configured.

## Demo 5 — FROZEN / PRESERVED

- 冻结日期：2026-09-13。
- 永久路由：`/followthrough`，直接返回独立网页，浏览器保留此地址。
- 固定版本：FT—02，银黑护甲、冰蓝发光核心、透明悬浮环；滚动拆解与重新组装，对话与跟进卡片同步切换。
- 仅当用户明确要求「更新 Demo 5 / update Demo 5」时才允许修改。未来新概念、LeadsTou 或首页工作不得改动 Demo 5。
- 全部资源：`public/followthrough/`。独立 HTML、CSS、动画脚本、Three.js 和本地字体，不依赖其他 Demo 的组件、样式或运行时。
- 隔离入口：Vercel 精确路由和 Vite 独立文档处理，均不经过共享 React 应用。
- 完整性记录：`preservation/demo-5.sha256.json`；校验命令：`npm run verify:demo5`。构建前自动验证，任何冻结文件被修改或遗漏均会阻止构建。
- 修改规则保存在根目录 `AGENTS.md`，供未来工作遵循。
- 本地查看：`npm run dev` 后访问 `/followthrough`。
- 此版本以 `Add Demo 5 followthrough AI device concept` 提交并通过现有 GitHub → Vercel 生产部署流程发布。
- 这是视觉演示，未连接真实 AI 或发送服务。
