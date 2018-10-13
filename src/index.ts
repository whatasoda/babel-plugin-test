import * as Babel from '@babel/core';
import createStepGenerator from './step';

export = ({ types: t }: typeof Babel): Babel.PluginObj => {
  const genStep = createStepGenerator(t);
  return {
    visitor: {
      VariableDeclaration(path) {
        path.get('declarations').forEach(declaration => {
          const initPath = declaration.get('init');
          if (initPath.node) {
            const step = genStep('init', initPath.node);
            if (step) initPath.replaceWith(step);
          }
        });
      },
      
      ArrowFunctionExpression(path) {
        path.node.async = true;
        const funcStep = genStep('func', path.node);
        if (funcStep) {
          path.replaceWith(funcStep);
        }
      },
      
      MemberExpression(path) {
        const memStep = genStep('member', path.node);
        if (memStep) {
          path.replaceWith(memStep);
        }
        
        const objStep = genStep('memberObj', path.node.object);
        if (objStep) {
          path.get('object').replaceWith(objStep);
        }
      },
      
      CallExpression(path) {
        path.get('arguments').forEach((argument) => {
          const step = genStep('callArg', argument.node);
          if (step) {
            argument.replaceWith(step);
          }
        })
      },
    },
    
  }
};


