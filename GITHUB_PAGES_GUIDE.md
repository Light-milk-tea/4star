# GitHub Pages 部署详细步骤

## 前置条件
1. 已安装 Node.js 和 npm
2. 已安装 Git
3. 已注册 GitHub 账号

## 步骤一：初始化 Git 仓库

在当前项目目录下执行：

```bash
# 初始化 git 仓库
git init

# 添加所有文件到暂存区
git add .

# 提交文件
git commit -m "Initial commit: Vue3 4star website"

# 创建 main 分支
git branch -M main
```

## 步骤二：创建 GitHub 仓库

### 方法一：通过 GitHub 网站创建
1. 打开 [github.com](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 仓库名称填写：`4star`
4. 选择 "Public"（公开仓库）
5. 不要勾选 "Initialize this repository with README"
6. 点击 "Create repository"

### 方法二：通过 GitHub CLI（如果已安装）
```bash
gh repo create 4star --public --description "Vue3 4star website"
```

## 步骤三：连接本地仓库与 GitHub

### 如果你通过网站创建了仓库，执行：
```bash
# 添加远程仓库地址（将 YOUR_USERNAME 替换为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/4star.git

# 推送代码到 GitHub
git push -u origin main
```

### 如果通过 GitHub CLI 创建，应该已经自动连接了

## 步骤四：启用 GitHub Pages

1. 打开你的 GitHub 仓库页面：`https://github.com/YOUR_USERNAME/4star`
2. 点击上方的 "Settings" 标签
3. 在左侧菜单中找到 "Pages"（页面）选项
4. 在 "Source"（源）部分：
   - 选择 "Deploy from a branch"（从分支部署）
   - 选择 "main" 分支
   - 选择 "/ (root)" 文件夹
   - 点击 "Save"

## 步骤五：等待部署完成

1. 返回仓库主页
2. 点击上方的 "Actions" 标签
3. 你会看到一个工作流正在运行
4. 等待状态变成绿色 ✓（通常需要 1-3 分钟）

## 步骤六：访问你的网站

部署完成后，你的网站可以通过以下地址访问：
```
https://YOUR_USERNAME.github.io/4star/
```

## 后续更新

当你修改代码后，只需要执行：
```bash
git add .
git commit -m "更新描述"
git push origin main
```
GitHub Actions 会自动重新部署你的网站。

## 常见问题解决

### 1. 如果页面空白或显示 404
- 确保 vite.config.ts 中的 base 设置正确：`base: '/4star/'`
- 等待几分钟让部署完成
- 检查 GitHub Actions 是否成功运行

### 2. 如果样式或资源加载失败
- 检查浏览器控制台是否有错误
- 确保所有资源路径使用相对路径
- 重新构建项目：`npm run build`

### 3. 自定义域名（可选）
如果你想使用自己的域名：
1. 在仓库的 Settings > Pages 中添加自定义域名
2. 在你的域名 DNS 设置中添加 CNAME 记录指向 `YOUR_USERNAME.github.io`

## 验证部署成功

打开你的网站，你应该能看到：
- 渐变背景（蓝紫色）
- 大字体显示 "4star"
- 闪烁的星星图标 ⭐

如果看到这些内容，说明部署成功了！🎉