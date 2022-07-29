export type FilterParams = {
  page: number;
  pageSize: number;
  order?: string;
  relations?: string;
  select?: string;
} & Record<`q.${string}`, string>;

export type FilterOptions = {
  /**
   * Used to validate "queryable" keys fields.
   * @example ['name']
   */
  query?: string[];
  /**
   * Used to validate "selectable" fields.
   * @example ['id', 'name']
   */
  select?: string[];
  /**
   * Used to validate "orderable" fields.
   * @example ['createdAt']
   */
  order?: string[];
  /**
   * Used to validate relations that need joins to be injected.
   * @example ['author', 'comments', 'comments.author']
   */
  relations?: string[];
  /**
   * Useful to disable validations.
   * @default: true
   */
  strict?: boolean;
  /**
   * Useful to disable pagination when it does not are needed.
   * This includes the 'page' and 'pageSize' parameters.
   * @default: true
   */
  pagination?: boolean;
};

export type Filters<E = any> = {
  page: number;
  pageSize: number;
  order: Record<keyof E | string, 'ASC' | 'DESC'>;
  relations: Array<keyof E & string>;
  select: string[];
  queries: Record<keyof E & string, string>;
};

export type Page<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  isLast: boolean;
};
