import { NgModule } from '@angular/core';

// 无论是 diapatch action 还是去 store 中取得最新的状态，都是通过这个去做的
// StoreModule -- redux 中的 store
import { ActionReducer, combineReducers, StoreModule } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

// ngrx 为路由提供的一个 store
// 它会把每次路由的变化做一个 reducer/state 的存储
// 所以可以通过这个 store 去取得当前变化的路由，也可以让其去发送一些 action，让我们导航到某一个路由上去
import { RouterStoreModule } from '@ngrx/router-store';

// 开发者工具
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// 提供函数记忆功能
import { createSelector } from 'reselect';
import { environment } from '../../environments/environment';
import { Auth } from '../domain';
import * as authActions from '../actions/auth.action';
/**
 * compose 函数是一个很方便的工具，简单来说，它接受任意数量的函数作为参数，然后返回一个新的函数。
 * 这个新的函数其实就是前面的函数的叠加，比如说，我们给出 `compose(f(x), g(x))`, 返回的新函数
 * 就是 `g(f(x))`。
 */
import { compose } from '@ngrx/core/compose';
/**
 * storeFreeze 用于防止 state 被修改，在 Redux 中我们必须确保 state 是不可更改的，这个函数
 * 有助于帮我们检测 state 是否被有意或无意的修改了。当 state 发生修改时，会抛出一个异常，这一点
 * 在开发时非常有帮助。根据环境变量的值，发布时会不包含这个函数。
 */
// 利用 ngrx-store-freeze 来冻结状态，在开发过程中，如果写入了原有状态就会报错
import { storeFreeze } from 'ngrx-store-freeze';
/**
 * 分别从每个 reducer 中将需要导出的函数或对象进行导出
 */
import * as fromAuth from './auth.reducer';
import * as fromQuote from './quote.reducer';
import * as fromProjects from './project.reducer';
import * as fromTaskLists from './task-list.reducer';
import * as fromTasks from './task.reducer';
import * as fromUsers from './user.reducer';
import * as fromTheme from './theme.reducer';

/**
 * 正如我们的 reducer 像数据库中的表一样，我们的顶层 state 也包含各个子 reducer 的 state
 * 并且使用一个 key 来标识各个子 state
 */
export interface State {
  auth: Auth;
  quote: fromQuote.State;
  projects: fromProjects.State;
  taskLists: fromTaskLists.State;
  tasks: fromTasks.State;
  users: fromUsers.State;
  theme: fromTheme.State;
  router: fromRouter.RouterState;
}

// 定义一个全局的 reducers，包含所有分支的 reducer
const reducers = {
  auth: fromAuth.reducer,
  quote: fromQuote.reducer,
  projects: fromProjects.reducer,
  taskLists: fromTaskLists.reducer,
  tasks: fromTasks.reducer,
  users: fromUsers.reducer,
  theme: fromTheme.reducer,
  router: fromRouter.routerReducer,
};

// ngrx 提供了我们一个方法 combineReducers()，用于把所有的 reducers 进行合并后成为一个全局的 reducer
// combineReducers 接收一系列的 reducer 作为参数，然后创建一个新的 reducer
// 这个新的 reducer 接收到各 reducer 的值后，按 reducer 的 key 进行存储
// 把这个新的 reducer 想象成一个数据库，各个子 reducer 就像数据库中的表
// 所有 reducer 返回的其实都是一个 state
const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
/**
 * 使用 combineReducers 把所有子 reducer 合并产生一个顶级 reducer
 */
const productionReducer: ActionReducer<State> = combineReducers(reducers);

const initState = {
  auth: fromAuth.initialState,
  quote: fromQuote.initialState,
  projects: fromProjects.initialState,
  taskLists: fromTaskLists.initialState,
  tasks: fromTasks.initialState,
  users: fromUsers.initialState,
  theme: fromTheme.initialState,
  router: fromRouter.initialState
};

// 利用 compose 来合并多个，原理是把前一个函数当作后一个函数的参数传递进去
// compose 函数是一个很方便的工具，简单来说，它接受任意数量的函数作为参数，然后返回一个新的函数
// 这个新的函数其实就是前面的函数的叠加，比如说，我们给出 `compose(f(x), g(x))`, 返回的新函数就是 `g(f(x))`
// 在合并前，用 ngrx-store-freeze 来对 reducers 做一个保护
// storeFreeze 用于防止 state 被修改，在 Redux 中我们必须确保 state 是不可更改的，这个函数
// 有助于帮我们检测 state 是否被有意或无意的修改了，当 state 发生修改时，会抛出一个异常，这一点
// 在开发时非常有帮助，根据环境变量的值，发布时会不包含这个函数
// const developmentReducers: ActionReducer<any> = compose(storeFreeze, combineReducers)(reducers);
export function reducer(state: any, action: any) {
  // 根据开发环境来进行判断
  // 处理完成以后在放入下面的 StoreModule.provideStore() 当中
  if (action.type === authActions.ActionTypes.LOGOUT) {
    return initState;
  }
  if (environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}

export const getAuthState = (state: State) => state.auth;
export const getQuoteState = (state: State) => state.quote;
export const getProjectsState = (state: State) => state.projects;
export const getTaskListsState = (state: State) => state.taskLists;
export const getTasksState = (state: State) => state.tasks;
export const getUserState = (state: State) => state.users;
export const getRouterState = (state: State) => state.router;
export const getThemeState = (state: State) => state.theme;

// 可以把任意个数函数组合在一起，形成一个有记忆功能的函数（缓存）
// 除了最后一个参数之外，前面所有的参数都是其输入性参数，都会当作最后一个参数（函数）的参数传入进去
// 简单来说，无论有多少个参数，只有最后一个才是用于函数计算，其他的都是它的输入
export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);
export const getProjects = createSelector(getProjectsState, fromProjects.getAll);
export const getTasks = createSelector(getTasksState, fromTasks.getTasks);
export const getUsers = createSelector(getUserState, fromUsers.getUsers);
export const getTheme = createSelector(getThemeState, fromTheme.getTheme);

const getSelectedProjectId = createSelector(getProjectsState, fromProjects.getSelectedId);
const getTaskLists = createSelector(getTaskListsState, fromTaskLists.getTaskLists);
const getTaskListEntities = createSelector(getTaskListsState, fromTaskLists.getEntities);
const getTaskListSelectedIds = createSelector(getTaskListsState, fromTaskLists.getSelectedIds);
const getCurrentAuth = createSelector(getAuthState, fromAuth.getAuth);
const getProjectEntities = createSelector(getProjectsState, fromProjects.getEntities);
const getUserEntities = createSelector(getUserState, fromUsers.getEntities);
const getTasksWithOwner = createSelector(getTasks, getUserEntities, (tasks, entities) => tasks.map(task =>
  (
    {
      ...task,
      owner: entities[task.ownerId],
      participants: task.participantIds.map(id => entities[id])
    }
  )));
export const getSelectedProject = createSelector(getProjectEntities, getSelectedProjectId, (entities, id) => {
  return entities[id];
});
export const getProjectTaskList = createSelector(getSelectedProjectId, getTaskLists, (projectId, taskLists) => {
  return taskLists.filter(taskList => taskList.projectId === projectId);
});
export const getTasksByList = createSelector(getProjectTaskList, getTasksWithOwner, (lists, tasks) => {
  return lists.map(list => ({ ...list, tasks: tasks.filter(task => task.taskListId === list.id) }));
});
export const getProjectMembers = (projectId: string) => createSelector(getProjectsState, getUserEntities, (state, entities) => {
  return state.entities[projectId].members.map(id => entities[id]);
});
export const getAuth = createSelector(getCurrentAuth, getUserEntities, (_auth, _entities) => {
  return { ..._auth, user: _entities[_auth.userId] };
});
export const getAuthUser = createSelector(getCurrentAuth, getUserEntities, (_auth, _entities) => {
  return _entities[_auth.userId];
});
export const getMaxListOrder = createSelector(getTaskListEntities, getTaskListSelectedIds, (entities, ids) => {
  const orders: number[] = ids.map(id => entities[id].order);
  return orders.sort()[orders.length - 1];
});

@NgModule({
  imports: [
    // 这里传递的 reducer 应该是整个应用的全局性的 reducer
    // StoreModule.provideStore  仅需引入一次，请把它包含在根模块或者 CoreModule 中
    // 我们这里为了方便组织，新建了一个 AppStoreModule，但也是只在 CoreModule 中引入的
    StoreModule.provideStore(reducer),
    RouterStoreModule.connectRouter(),
    // DevTool 需要在 StoreModule 之后导入
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 5
    })
  ]
})
export class AppStoreModule {
}
