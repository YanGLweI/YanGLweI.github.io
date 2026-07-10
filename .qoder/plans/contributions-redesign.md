# Contributions Section 样式与动画重构

## Context

Contributions section 当前沿用 GitHub 原生的绿色热力图配色和独立动画模式，与站点整体设计语言（cream/black 主色调、noise overlay、统一缓动曲线）不一致。需要重新设计使其与 ProfileHero、Projects 两个 section 风格统一。

## 修改文件

- `src/components/Contributions.tsx`

## Task 1: 配色系统 — 绿色替换为 cream 透明度梯度

将 `getColor` 函数中的 GitHub 绿色替换为站点主色 `#E1E0CC` 的透明度梯度：

```ts
const colors = [
  'rgba(225, 224, 204, 0.05)',  // Level 0
  'rgba(225, 224, 204, 0.15)',  // Level 1
  'rgba(225, 224, 204, 0.30)',  // Level 2
  'rgba(225, 224, 204, 0.50)',  // Level 3
  'rgba(225, 224, 204, 0.80)',  // Level 4
];
```

## Task 2: Section 结构对齐 Projects 模式

- `<section>` 加 `relative`
- 新增 noise overlay: `<div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none" />`
- 删除外层 `bg-[#101010] rounded-2xl` 包裹 div
- 内容包裹改为 `<div className="relative z-10 max-w-7xl mx-auto">`
- 热力图卡片: `bg-[#0d1117]` -> `bg-[#212121]`，删除 `border border-gray-800`

## Task 3: 动画系统重构

- import 增加 `useInView`
- 新增 `sectionRef` + `isInView = useInView(sectionRef, { once: true, margin: '-100px' })`
- Header/Card 动画改为滚动触发，easing 统一为 `[0.22, 1, 0.36, 1]`
- **关键优化**: 364 个 cell 的 `motion.div` 全部替换为普通 `div`，改用列级 CSS `transition-delay` stagger（每列 30ms），从 364 个 framer-motion 实例降为 0

## Task 4: Tooltip 重新设计

- 背景 `#1b1f23` -> `#212121`
- 文字 `text-white` -> `text-[#E1E0CC]`
- 数字高亮用 `text-primary`
- 删除 border，箭头颜色同步

## 验证

- 运行 dev server 检查热力图渲染正常
- 滚动到 Contributions 区域确认动画触发
- 检查 tooltip 交互和配色
- 检查响应式布局
