# 4star Website

一个基于 Vue3 + TypeScript + Vite 的简洁网站，围绕“纯四星”玩法进行数据与页面展示。

## 特性
- 淡黄色主题的现代化配色
- 合约冠军数排行（纯四星）
- 四星角色满意度（建设中）
- DPS 计算器（建设中）

## 本地开发
```bash
npm install
npm run dev
```
启动后按控制台输出的地址访问（例如 `http://localhost:5173/`）。

## 构建
```bash
npm run build
```
构建产物输出到 `dist/`，可直接用于静态托管。

## 数据来源与维护
- 排行页面数据文件：`public/excel/champions.json`
- 原始数据表：`excel/四星冠军数.csv`
- 转换脚本：`csv_to_json.py`（将 CSV 转为 JSON，并按冠军数降序）

更新数据的推荐流程：
1. 编辑 `excel/四星冠军数.csv`
2. 运行 `csv_to_json.py` 生成最新 `excel/champions.json`
3. 将生成的 JSON 复制到 `public/excel/champions.json`

## 主要页面
- 主页：`src/pages/Home.vue`
- 合约冠军数排行：`src/pages/ChampionRank.vue`
- 四星角色满意度：`src/pages/FourStarSatisfaction.vue`
- DPS 计算器：`src/pages/DpsCalculator.vue`

## 路由
单页应用路由位于：`src/router.ts`

## 部署建议
- GitHub Pages：在仓库设置启用 Pages，发布 `dist/` 构建产物
- Netlify：拖拽 `dist/` 目录或连接仓库自动部署
- Vercel：导入仓库，一键部署

## 技术栈
- Vue 3
- TypeScript
- Vite
- Vue Router
