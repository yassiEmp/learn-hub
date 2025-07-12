export type funcResponseOrError<T> =
  | { err: string; data: null }
  | { err: null; data: T };