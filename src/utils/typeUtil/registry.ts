import * as Babel from '@babel/core';
import { MemoryUtil } from '../memoryUtil';

const Registry = (t: typeof Babel.types, memoryUtil: MemoryUtil) => {
  const register = () => {
    const {
      stringLiteral,
      numericLiteral,
      booleanLiteral,
      awaitExpression,
      callExpression,
      identifier,
      objectProperty,
      objectExpression,
      arrowFunctionExpression,
      blockStatement,
      memberExpression,
      assignmentExpression,
      program,
      expressionStatement,
    } = t;
    return memoryUtil.wrapAll({
      stringLiteral,
      numericLiteral,
      booleanLiteral,
      awaitExpression,
      callExpression,
      identifier,
      objectProperty,
      objectExpression,
      arrowFunctionExpression,
      blockStatement,
      memberExpression,
      assignmentExpression,
      program,
      expressionStatement,
    });
  };
  
  return { register };
}

export default Registry;

