export interface Table {
  name: string;
  guid: string;
  sheets: string[];
  skipHead: number;
  columns: {
    name: string;
    parser?: <T>(content: string) => T;
  }[];
}
