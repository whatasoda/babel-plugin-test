import { Memory, createMemProxy } from './memory';
import Wrap from './wrap';
import Pass from './pass';

const createMemoryUtil = (mem: Memory) => Object.assign(
  {},
  Wrap(mem),
  Pass(mem),
);

export type MemoryUtil = ReturnType<typeof createMemoryUtil>;

export { createMemProxy, createMemoryUtil };
