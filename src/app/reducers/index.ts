import { NgModule } from '@angular/core';

// 无论是 diapatch action 还是去 store 中取得最新的状态，都是通过这个去做的
// StoreModule -- redux 中的 store
import { StoreModule, combineReducers, ActionReducer } from '@ngrx/store';

// ngrx 为路由提供的一个 store
// 它会把每次路由的变化做一个 reducer/state 的存储
// 所以可以通过这个 store 去取得当前变化的路由，也可以让其去发送一些 action，让我们导航到某一个路由上去
import { RouterStoreModule } from '@ngrx/router-store'; 

// 开发者工具
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// 利用 ngrx-store-freeze 来冻结状态，在开发过程中，如果写入了原有状态就会报错
import { storeFreeze } from 'ngrx-store-freeze'
import { compose } from '@ngrx/core/compose'
import { environment } from '../../environments/environment';

// 提供函数记忆功能
import { createSelector } from 'reselect'

// 分别从每个 reducer 中将需要导出的函数或对象进行导出
import * as fromQuote from './quote.reducer';

// 定一个全局的 State，包含各个子 reducer 的 state，并且使用一个 key 来标识各个子 state
export interface State {
  quote: fromQuote.State;
};

// 定义一个全局的初始值，里面还有每一项对应的各自的初始值（state 的初始值）
const initialState: State = {
  quote: fromQuote.initialState
};

// 定义一个全局的 reducers，包含所有分支的 reducer
const reducers = {
  quote: fromQuote.reducer
}

// ngrx 提供了我们一个方法 combineReducers()，用于把所有的 reducers 进行合并后成为一个全局的 reducer
// combineReducers 接收一系列的 reducer 作为参数，然后创建一个新的 reducer
// 这个新的 reducer 接收到各 reducer 的值后，按 reducer 的 key 进行存储
// 把这个新的 reducer 想象成一个数据库，各个子 reducer 就像数据库中的表
// 所有 reducer 返回的其实都是一个 state
const productionReducers: ActionReducer<State> = combineReducers(reducers)
// 利用 compose 来合并多个，原理是把前一个函数当作后一个函数的参数传递进去
// compose 函数是一个很方便的工具，简单来说，它接受任意数量的函数作为参数，然后返回一个新的函数
// 这个新的函数其实就是前面的函数的叠加，比如说，我们给出 `compose(f(x), g(x))`, 返回的新函数就是 `g(f(x))`
// 在合并前，用 ngrx-store-freeze 来对 reducers 做一个保护
// storeFreeze 用于防止 state 被修改，在 Redux 中我们必须确保 state 是不可更改的，这个函数
// 有助于帮我们检测 state 是否被有意或无意的修改了，当 state 发生修改时，会抛出一个异常，这一点
// 在开发时非常有帮助，根据环境变量的值，发布时会不包含这个函数
// const developmentReducers: ActionReducer<any> = compose(storeFreeze, combineReducers)(reducers);

export function reducer(state = initialState, action: any): State {
  // 根据开发环境来进行判断
  // 处理完成以后在放入下面的 StoreModule.provideStore() 当中
  // return environment.production ?
  //   productionReducers(state, action) :
  //   developmentReducers(state, action)
  return productionReducers(state, action)
}

export const getQuoteState = (state: State) => state.quote;

// 可以把任意个数函数组合在一起，形成一个有记忆功能的函数（缓存）
// 除了最后一个参数之外，前面所有的参数都是其输入性参数，都会当作最后一个参数（函数）的参数传入进去
// 简单来说，无论有多少个参数，只有最后一个才是用于函数计算，其他的都是它的输入
export const getQuote = createSelector(getQuoteState, fromQuote.getQuote)

@NgModule({
  imports: [
    // 这里传递的 reducer 应该是整个应用的全局性的 reducer
    // StoreModule.provideStore  仅需引入一次，请把它包含在根模块或者 CoreModule 中
    // 我们这里为了方便组织，新建了一个 AppStoreModule，但也是只在 CoreModule 中引入的
    StoreModule.provideStore(reducer),
    RouterStoreModule.connectRouter(),
    // DevTool 需要在 StoreModule 之后导入
    // StoreDevtoolsModule.instrumentOnlyWithExtension(),
  ]
})

export class AppStoreModule {}