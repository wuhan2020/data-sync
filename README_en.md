# data-sync

![travis](https://travis-ci.com/wuhan2020/data-sync.svg?branch=master)

Information Collection Platform for Wuhan 2019-nCoV Epidemic Prevention - Data synchronization
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
- Use `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+

## Architecture Diagram

![arch](http://api.hypertrons.io/umlrenderer/github/wuhan2020/data-sync?path=static/architecture.puml)
