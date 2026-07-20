# 个人主页 - GitHub Pages

一个现代化的个人主页项目，基于 React 19 + TypeScript + Vite 构建，自动同步 GitHub 数据展示个人资料、贡献热力图和开源项目。

## ✨ 特性

- 🎨 **现代化设计** - 深色主题，简洁优雅的视觉风格
- 📊 **GitHub 数据同步** - 自动拉取个人资料、贡献图和仓库信息
- 🎬 **流畅动画** - 基于 Framer Motion 和 Anime.js 的交互动效
- 📱 **响应式布局** - 完美适配桌面端和移动端
- ⚡ **极速构建** - Vite 提供的秒级热更新和构建体验
- 🚀 **自动部署** - GitHub Actions 一键部署到 GitHub Pages
- 🔍 **类型安全** - TypeScript 6 全链路类型保障

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 |
| 语言 | TypeScript 6 |
| 构建工具 | Vite 8 |
| 样式方案 | Tailwind CSS 3 |
| 动画库 | Framer Motion 12 + Anime.js 4 |
| 图标库 | Lucide React |
| 代码检查 | Oxlint |
| 部署方案 | GitHub Pages + GitHub Actions |

## 📁 项目结构

```
.
├── .github/workflows/    # CI/CD 工作流配置
├── public/               # 静态资源
├── src/
│   ├── assets/           # 资源文件
│   ├── components/       # React 组件
│   │   ├── ProfileHero.tsx      # 个人资料头部
│   │   ├── Contributions.tsx    # 贡献热力图
│   │   ├── Projects.tsx         # 项目列表展示
│   │   ├── WordsPullUp.tsx      # 文字上拉动画
│   │   └── WordsPullUpMultiStyle.tsx  # 多风格文字动画
│   ├── services/         # API 服务层
│   │   └── github.ts     # GitHub API 封装
│   ├── App.tsx           # 主应用组件
│   ├── App.css           # 应用样式
│   ├── index.css         # 全局样式
│   └── main.tsx          # 应用入口
├── .env.example          # 环境变量示例
├── .oxlintrc.json        # Oxlint 配置
├── tailwind.config.js    # Tailwind 配置
├── vite.config.ts        # Vite 配置
└── package.json
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20
- npm >= 9

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

```env
# GitHub 用户名（必填）
VITE_GITHUB_USERNAME=your_github_username

# GitHub Personal Access Token（可选，用于获取贡献图数据）
VITE_GITHUB_TOKEN=your_github_personal_access_token_here
```

> **说明**: 
> - 不配置 Token 也能正常运行，但贡献热力图可能无法显示
> - Token 仅需 `public_repo` 权限即可

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看效果

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 🔧 GitHub Token 获取方式

1. 登录 GitHub，进入 [Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选 `public_repo` 权限
4. 生成 Token 并复制到 `.env` 文件中

## 📦 部署

项目已配置 GitHub Actions 自动部署工作流，推送到 `main` 分支后会自动构建并部署到 GitHub Pages。

### 部署步骤

1. 在 GitHub 仓库 Settings → Pages 中，将 Source 设置为 "GitHub Actions"
2. 在仓库 Settings → Secrets and variables → Actions 中添加以下 Secrets：
   - `VITE_GITHUB_USERNAME`: 你的 GitHub 用户名
   - `VITE_GITHUB_TOKEN`: 你的 GitHub Personal Access Token
3. 推送代码到 `main` 分支，自动触发部署

## 🎯 页面模块

### 1. ProfileHero - 个人资料
- 头像、昵称、用户名展示
- 个人简介（Bio）
- 粉丝、关注、仓库数量统计
- 社交链接导航
- 视频背景与文字动效

### 2. Contributions - 贡献热力图
- GitHub 年度贡献热力图展示
- 每日提交数量可视化
- 支持无 Token 降级显示

### 3. Projects - 项目展示
- 自动拉取公开仓库列表
- 仓库名称、描述、语言标签
- Star、Fork 数量统计
- 点击跳转 GitHub 仓库

## 📝 自定义配置

### 修改主题色

编辑 `tailwind.config.js` 自定义配色方案：

```js
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        // 自定义颜色
      },
    },
  },
}
```

### 添加新的页面模块

在 `src/components/` 下创建新组件，然后在 `App.tsx` 中引入即可。

## 📄 License

MIT License © 2026
