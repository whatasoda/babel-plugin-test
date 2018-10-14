import { Memory } from './memory';
import { Node } from '@babel/types';

const Wrap = (mem: Memory) => {
  
  type TCreatorFunc<TNode extends Node> = (...args: any[]) => TNode;
  const wrap = <TNode extends Node>(func: TCreatorFunc<TNode>): typeof func =>
    (...args) => {
      const created = func(...args);
      mem.created.push(created);
      return created;
    };
  
  const wrapAll = <TFuncMap extends { [_: string]: TCreatorFunc<any> }>(mapObj: TFuncMap): TFuncMap =>
    (Object.keys(mapObj) as Array<keyof TFuncMap>).reduce<TFuncMap>(
      (wraped, key) => (wraped[key] = wrap(mapObj[key]), wraped),
      {} as any
    );
    
  return { wrap, wrapAll };
};

export default Wrap;
