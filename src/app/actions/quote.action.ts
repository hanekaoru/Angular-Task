import { Action } from '@ngrx/store';
import { Quote } from '../domain/quote.model'
import { type } from '../utils/type.util';
 
// 将 action 的 type 从一个字符串变为了一个字典类型的对象
// 然后使用工具函数 type() 将其转换为一个类型
// [...] 用中括号表明是哪一个 reducer，后面跟着的是描述
export const ActionTypes = {
  LOAD: type('[Quote] Load'),
  LOAD_SUCCESS: type('[Quote] Load Success'),
  LOAD_FAIL: type('[Quote] Load Fail'),
};

// 一个实现 Action 接口的类，所以应当有 type 与 payload
export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: null) { }
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: Quote) { }
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  // 希望将错误信息返回，所以是一个 string 类型
  constructor(public payload: string) { }
}

// 最后导出一个 Actions 的集合，它会把我们定义好的 action 用 | 连接起来
export type Actions 
  = LoadAction 
  | LoadSuccessAction 
  | LoadFailAction;

