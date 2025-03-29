# 大体协数据库 - 前端

本前端修改自 [Next.js 小作业](https://git.tsinghua.edu.cn/se-2025spring/2025-next-hw)

## 安装环境

按照[小作业手册](https://thuse-course.github.io/course-index/handout/react/environment/)的指导，安装完成node.js与pnpm。

举例来说，WSL2可以这样操作：
```bash
mkdir ~/workspace && cd ~/workspace
wget https://nodejs.org/dist/v22.14.0/node-v22.14.0-linux-x64.tar.xz
tar -xf node-v22.14.0-linux-x64.tar.xz
cd node-v22.14.0-linux-x64/bin
pwd
```
请将这个输出的路径添加到环境变量中。为了方便，你可以在 `~/.bashrc` 最后加上这句话：
```bash
export PATH=~/workspace/node-v22.14.0-linux-x64/bin:$PATH
```
随后回到你的终端，运行：
```bash
source ~/.bashrc
```
以重载配置。
至此我们安装好了 node.js ，可以终端输入指令 `node -v` 确认。

接下来，我们启用包管理器，下载项目，安装依赖：
```bash
corepack enable # 启用包管理器的管理器 corepack
git clone <OUR_PROJECT>
cd <PATH_TO_OUR_PROJECT>
pnpm install # 安装项目依赖
```

## 运行前端服务器

直接在项目文件夹里运行：
```bash
pnpm dev
```
接下来你可以在 http://localhost:3000/ 看到前端页面

# OLD README

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
