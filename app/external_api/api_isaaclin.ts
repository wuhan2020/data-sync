import { ApiConfig } from './api';

const baseUrl = 'https://lab.ahusmart.com/nCoV/api/';

const isaaclinApi: ApiConfig[] = [
  {
    url: `${baseUrl}area`,
    getFilePath: () => 'map-viz/current.json',
  },
  {
    url: `${baseUrl}area?latest=0`,
    getFilePath: () => 'map-viz/history.json',
  },
  {
    url: `${baseUrl}overall?latest=0`,
    getFilePath: () => 'map-viz/overall.json',
  },
];

export default isaaclinApi;
