import datacache from './extend/datacache';
import { Cache } from './extend/Cache';

declare module 'egg' {
  interface Application {
    datacache: Cache;
  }
}
