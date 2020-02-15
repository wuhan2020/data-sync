import datacache from './extend/datacache';

declare module 'egg' {
  interface Application {
    datacache: datacache & Singleton<datacache>;
  }

}
