import { Node } from '@babel/types';

export interface Memory {
  readonly [_: string]: Node[];
  readonly native: Node[];
  readonly created: Node[];
}

export const createMemProxy = (): Memory => new Proxy<Memory>({
  native: [], created: [],
}, {
  get(target, key) {
    key = key.toString();
    if (!target[key]) {
      Object.defineProperty(target, key, { value: [], enumerable: true });
    }
    return target[key];
  }
});
