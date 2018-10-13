import * as Babel from '@babel/core';
import { Node, Expression, SpreadElement } from '@babel/types';
import generate from '@babel/generator';

const stepIdentifier = '$'
// const memory: Node[] = [];
const memory = {
  all: [] as Node[],
  native: [] as Node[],
  func: [] as Node[],
}
const codes: string[] = [];

const pass = <TNode extends Node>(node: TNode) => (memory.all.push(node), node);
const isPassed = <TNode extends Node>(node: TNode) => memory.all.includes(node);
const isPassedNative = <TNode extends Node>(node: TNode) => memory.native.includes(node);
const clone = <TNode extends Node>(node: TNode) => (memory.native.push(node), addCode(node), node);
const addCode = (node: Node) => codes.push(generate(node).code);

let id = 0;

const stepGenerator = (t: typeof Babel.types) => {
  const isAcceptable = (node: object): node is Expression | SpreadElement =>
    t.isExpression(node) || t.isSpreadElement(node);
    
  const isAvailable = (node: Node): node is Expression | SpreadElement =>
    !isPassed(node) && isAcceptable(node);
    
  return (type: string, node: Node | Node[]) => {
    if (type === 'func') {
      if (!Array.isArray(node) && isPassedNative(node)) {
        if (!memory.func.includes(node)) {
          const na = memory.all.indexOf(node);
          const ni = memory.native.indexOf(node);
          memory.all.splice(na,1);
          memory.native.splice(ni,1);
          memory.func.push(node)
        }
      }
    }
    
    let cloned: Expression | SpreadElement | null = null;
    if (Array.isArray(node)) {
      const filtered = node.map(n => isAvailable(n) ? pass(clone(n)) : null).filter(Boolean);
      if (!filtered.length) return null;
      cloned = t.arrayExpression(filtered);
    } else {
      cloned = isAvailable(node) ? pass(clone(node)) : null;
    }
    if (!cloned) return null;
    
    return pass(t.awaitExpression(
      pass(t.callExpression(
        pass(t.identifier(stepIdentifier)),
        [pass(t.stringLiteral(type)), pass(t.numericLiteral(id++)), cloned]
      ))
    ));
  };
}
  
  
export default stepGenerator;
