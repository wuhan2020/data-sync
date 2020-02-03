# data-sync [[English]](https://github.com/wuhan2020/data-sync/blob/master/README_en.md)

![travis](https://travis-ci.com/wuhan2020/data-sync.svg?branch=master)

武汉新型冠状病毒防疫信息收集平台-数据同步服务
using typescript && egg

## 快速上手指南

### 开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

不要在开发者模式下进行 tsc编译, 如果你需要运行 `tsc` ，则你必须先运行 `npm run clean`，再运行`npm run dev`。

### 部署

```bash
$ npm run tsc
$ npm start
```

### Npm 脚本

- 使用 `npm run lint` 来检查代码的样式
- 使用 `npm test` 来执行单元测试
- 使用 `npm run clean` 在开发者模式下一次性清理编译后的js

### 环境依赖

- Node.js 8.x
- Typescript 2.8+

## 功能架构图

![arch](http://api.hypertrons.io/umlrenderer/github/wuhan2020/data-sync?path=static/architecture.puml)
