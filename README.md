# micro-frontend demo

一个使用的 qiankun 实现的微前端 demo。微前端分为主应用和子应用，这个 demo 的应用均使用 vue2.6 实现。

## 运行

```sh
$ npm i -g pnpm
$ pnpm i -r
$ pnpm run build
```
然后 cd 到 `demos` 各个目录下运行 `pnpm run serve` 启动本地开发环境。

- `demos` 主应用（portal）和子应用(module-xxx)
- `packages/applet-loader` qiankun 简单封装。

## Vue 项目改微前端 tips

[点击这里](TIPS.md)