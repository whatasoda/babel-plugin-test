import * as Babel from '@babel/core';
import { Node, ObjectProperty, Program, Expression, SpreadElement, ObjectExpression } from '@babel/types';
import generate from '@babel/generator';
import { createMemProxy, createMemoryUtil } from './utils/memoryUtil';
import cretaeTypeUtil from './utils/typeUtil';
import { NodePath } from '@babel/traverse';

interface StepProfile extends Pick<Node, 'type' | 'start' | 'end'> {
  id: number;
}

interface StagedStep {
  args: [ObjectExpression, Expression | SpreadElement] | null;
  path: NodePath<Node | null>
};

const Step = (stepCallee: string, types: typeof Babel.types) => {
  const util = cretaeTypeUtil(types, createMemoryUtil(createMemProxy()));
  const t = util.register();
  
  const PrimitiveLiteral = (value: string | number | boolean) =>
    typeof value === 'string' ? t.stringLiteral(value) :
    typeof value === 'number' ? t.numericLiteral(value) :
    typeof value === 'boolean' ? t.booleanLiteral(value) : null;
    
  const genProfileNode = (profile: StepProfile) => t.objectExpression(
    (Object.keys(profile) as Array<keyof StepProfile>).reduce<ObjectProperty[]>(
      (props, key) => {
        const value = profile[key];
        if (value !== null) {
          const keyNode = t.identifier(key);
          const valueNode = PrimitiveLiteral(value);
          if (keyNode && valueNode) {
            props.push(t.objectProperty(keyNode, valueNode));
          };
        }
        return props;
      },
      [],
    )
  );
  
  const defaultProfileGen = () => null;
  let i = 0;
  const applyStep = <TNode extends Node>(
    pathes: Array<NodePath<TNode | null>>,
    profileGen: (path: NodePath<TNode>) => any = defaultProfileGen,
  ) => {
    pathes.map<StagedStep>(path => {
      const node = util.isAvailable(path.node) ? util.pass(path.node) : null;
      if (!node) return { path, args: null };
      
      const { type, start, end } = node;
      const extraProfile = profileGen(path as any) || {};
      const profileNode = genProfileNode(Object.assign(
        { type, start, end, id: i++ },
        extraProfile,
      ));
      
      return { path, args: [profileNode, node] };
    }).forEach(replace);
  };
  
  const replace = ({ path, args }: StagedStep) => {
    if (args) {
      const step = t.awaitExpression(
        t.callExpression(
          t.identifier(stepCallee),
          args
        )
      );
      path.replaceWith(step);
    }
  };
  
  const wrapProgram = (path: NodePath<Program>) => {
    if (util.isAvailableNative(path.node)) {
      const exportsNode = t.memberExpression(
        t.identifier('module'),
        t.identifier('exports')
      );
      
      const afNode = t.arrowFunctionExpression(
        [t.identifier(stepCallee)],
        t.blockStatement(path.node.body)
      );
      
      const objNode = t.objectExpression([
        t.objectProperty(t.identifier('code'), afNode),
        t.objectProperty(t.identifier('src'), t.stringLiteral(generate(path.node).code)),
      ]);
      
      path.replaceWith(
        t.program([
          t.expressionStatement(
            t.assignmentExpression('=', exportsNode, objNode)
          )
        ])
      );
    }
  };
  
  return { applyStep, wrapProgram };
}
  
  
export default Step;
  