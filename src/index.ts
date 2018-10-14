import * as Babel from '@babel/core';
import createStepGenerator from './step';

export = ({ types: t }: typeof Babel): Babel.PluginObj => {
  const { applyStep, wrapProgram } = createStepGenerator('$', t);
  return {
    visitor: {
      Program(path) {
        wrapProgram(path);
      },
      
      VariableDeclaration(path) {
        applyStep(
          path.get('declarations').map(declaration => declaration.get('init')),
          ({ parent }) => {
            if (!t.isVariableDeclarator(parent)) return;
            const { id } = parent;
            if (!t.isIdentifier(id)) return;
            const { name } = id;
            return { name };
          }
        );
      },
      
      ArrowFunctionExpression(path) {
        path.node.async = true;
        applyStep([path]);
      },
      
      MemberExpression(path) {
        applyStep([path.get('object'), path]);
      },
      
      CallExpression(path) {
        applyStep([...path.get('arguments'), path]);
      },
      
    },
    
  }
};


