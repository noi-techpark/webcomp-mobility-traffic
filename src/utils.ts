export type Selectable<T> = T & {selected?: boolean};

export type WithStartEnd<T> = T & {isStart?: boolean, isEnd?: boolean};
