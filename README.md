# data-sync

武汉新型冠状病毒防疫信息收集平台-数据同步服务
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

```plantuml
@startuml
!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Container.puml

'LAYOUT_WITH_LEGEND()
LAYOUT_AS_SKETCH()

Person(volunteer, "志愿者")

System_Boundary(database,"数据集合"){
    System(shimo, "石墨", "excel表单集合")
    System(github, "wuhan2020/wuhan2020", "yaml文件集合")
}

System_Boundary(data, "wuhan2020/data-sync"){
    System(dataFetcher, "数据获取模块", "")
    System_Boundary(dataParser, "数据解析模块"){
        System_Ext(pluginYML, "YAML插件")
        System_Ext(pluginXML, "XML插件")
        System_Ext(pluginCVS, "CVS插件")
        System_Ext(pluginOther, "...")
    }
}

System_Boundary(web, "wuhan2020/web-server"){
    System(webAPI, "rest-API 服务器", "")
    System(webFront, "web前端展示", "")
}

Rel(volunteer, shimo, "填写表单")
Rel(shimo, dataFetcher, "原始数据获取")
Rel(dataFetcher, pluginYML,"数据解析")
Rel(dataFetcher, pluginXML,"数据解析")
Rel(dataFetcher, pluginCVS,"数据解析")
Rel(dataFetcher, pluginOther,"数据解析")
Rel(pluginYML, github, "yaml文件更新")
Rel(webAPI, github, "获取数据")
Rel(webFront, webAPI, "渲染页面")
@enduml
```
