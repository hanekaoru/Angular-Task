import * as actions from '../actions/quote.action';
import { Quote } from '../domain';

// 当前是 State
export interface State {
  quote: Quote
};

// 当前 State 的初始值
export const initialState: State = {
  quote: {
    cn: '默认值',
    en: '默认值',
    pic: 'assets/1.jpg'
  }
};

export function reducer(state = initialState, action: actions.Actions ): State {
  switch (action.type) {
    case actions.ActionTypes.LOAD_SUCCESS: {
      // 希望 payload 返回一个 state，然后利用这个 state 来返回一个新的 state
      // 相当于 return Object.assign({}, state, {quote: action.payload})
      // 因为我们导入的类型是 actions.Actions，它是一个并集，包含 Quote 和 string
      // 所以这里需要做一个强制类型转换 <Quote>
      return {...state, quote: <Quote>action.payload};
    }

    // 失败的话和默认的是一样的，直接返回一个原有的 state，不会做任何变化
    case actions.ActionTypes.LOAD_FAIL: 
    default: {
      return state;
    }
  }
}

// 解决 state.quote.quote 这样的情况
// 接收一个 state，返回一个 state.quote
export const getQuote = (state: State) => state.quote;