type GetFilePathFunc = (url: string) => string;

export interface ApiConfig {
  url: string;
  getFilePath: GetFilePathFunc;
}
