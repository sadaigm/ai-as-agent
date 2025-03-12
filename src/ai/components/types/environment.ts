export interface Environment {
  name: string;
  hostUrl: string;
  type: string;
  headers: { key: string; value: string }[];
}