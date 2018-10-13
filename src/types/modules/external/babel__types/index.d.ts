import { Expression } from '@babel/types';

declare module '@babel/types' {
  export function isExpression(node: object, opts?: object | null): node is Expression;
}
