import { Memory } from './memory';
import { Node } from '@babel/types';

const Pass = (mem: Memory) => {
  
  const pass = <TNode extends Node>(node: TNode) =>
    (mem[node.type].push(node), node);
  
  const isAvailableNative = <TNode extends Node>(node: TNode) =>
    (!mem.created.includes(node) && !mem[node.type].includes(node));
  
  return {
    pass,
    isAvailableNative,
  };
};

export default Pass;
