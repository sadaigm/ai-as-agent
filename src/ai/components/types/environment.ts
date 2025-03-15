export interface Environment {
  id: string;
  name: string;
  hostUrl: string;
  appBasePath?: string;
  type: string;
  headers: { key: string; value: string }[];
}