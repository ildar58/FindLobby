export type UniHandler<T, G> = (item: T) => G;
export type UniBooleanHandler<T> = UniHandler<T, boolean>;
export type UniStringHandler<T> = UniHandler<T, string>;
export type UniNumberHandler<T> = UniHandler<T, number>;
