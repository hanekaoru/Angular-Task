import { Quote } from '../domain';
import * as actions from '../actions/quote.action';

// 当前 State
export interface State {
  quote: Quote;
}

// 当前 State 的初始值
export const initialState: State = {
  quote: {
    cn: '满足感在于不断的努力，而不是现有成就。全心努力定会胜利满满。',
    en: 'Satisfaction lies in the effort, not in the attainment. Full effort is full victory. ',
    pic: 'assets/img/quote_fallback.jpg',
  }
};

export function reducer(state: State = initialState, action: actions.Actions): State {
  switch (action.type) {
    case actions.ActionTypes.QUOTE_SUCCESS:
      // 希望 payload 返回一个 state，然后利用这个 state 来返回一个新的 state
      // 相当于 return Object.assign({}, state, {quote: action.payload})
      // 因为我们导入的类型是 actions.Actions，它是一个并集，包含 Quote 和 string
      // 所以这里需要做一个强制类型转换 <Quote>
      return { ...state, quote: action.payload };
    // 失败的话和默认的是一样的，直接返回一个原有的 state，不会做任何变化
    case actions.ActionTypes.QUOTE_FAIL:
    default:
      return state;
  }
}

// 解决 state.quote.quote 这样的情况
// 接收一个 state，返回一个 state.quote
export const getQuote = (state: State) => state.quote;
