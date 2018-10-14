import * as Babel from '@babel/core';
import { MemoryUtil } from '../memoryUtil';
import { Expression, SpreadElement, Node } from '@babel/types';

const Availability = (t: typeof Babel.types, memoryUtil: MemoryUtil) => {
  
  const isAvailable = (node: Node | null): node is Expression | SpreadElement => (
    !!node &&
    (t.isExpression(node) || t.isSpreadElement(node)) &&
    memoryUtil.isAvailableNative(node)
  );
  
  return { isAvailable };
};

export default Availability;
