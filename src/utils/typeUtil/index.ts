import * as Babel from '@babel/core';
import Registry from './registry';
import { MemoryUtil } from '../memoryUtil';
import Availability from './availability';

const cretaeTypeUtil = (t: typeof Babel.types, memoryUtil: MemoryUtil) => Object.assign(
  {},
  memoryUtil,
  Registry(t, memoryUtil),
  Availability(t, memoryUtil),
);

export default cretaeTypeUtil;
