# data-sync

using typescript && egg

## QuickStart

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+

## 功能架构图

https://www.processon.com/view/link/5e2d2082e4b04579e40cc051

武汉新型冠状病毒防疫信息收集平台-数据同步服务

### 从石墨文档获取 excel 数据

包括：excel 子表名，表头，表行内容等

### 通过传入的数据和数据定义数据，给出解析后的格式化数据
