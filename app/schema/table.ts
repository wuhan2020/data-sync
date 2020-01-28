export interface Table {
  guid: string;
  sheets: string[];
  skipHead: number;
  name: string;
  prefix: string;
  columns: {
    name: string;
    type?: 'addr' | 'contact' | 'url' | undefined;
    parser?: <T>(content: string) => T;
  }[];
}
