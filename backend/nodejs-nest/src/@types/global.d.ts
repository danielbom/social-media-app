declare global {
  export type Id = number;
  export type Uuid = string;

  export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };
}

export {};
