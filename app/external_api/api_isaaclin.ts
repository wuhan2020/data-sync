import { ApiConfig } from './api';

const isaaclinApi: ApiConfig[] = [
  {
    url: 'https://lab.isaaclin.cn/nCoV/api/area',
    getFilePath: () => 'map-viz/current.json',
  },
  {
    url: 'https://lab.isaaclin.cn/nCoV/api/area?latest=0',
    getFilePath: () => 'map-viz/history.json',
  },
  {
    url: 'https://lab.isaaclin.cn/nCoV/api/overall?latest=0',
    getFilePath: () => 'map-viz/overall.json',
  },
];

export default isaaclinApi;
