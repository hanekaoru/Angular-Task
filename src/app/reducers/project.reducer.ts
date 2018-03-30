import { Project } from '../domain';
import { createSelector } from 'reselect';
import { covertArrToObj, buildObjFromArr } from '../utils/reduer.util';
import * as actions from '../actions/project.action';

export interface State {
  // id 做成一个数组
  ids: string[];
  // 分配成字典型，可以很方便的找到需要更新的一些值
  entities: { [id: string]: Project };
  // 会把选择的 project 记录下来
  selectedId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedId: null,
};

const addProject = (state, action) => {
  // 添加的时候，action 携带的是 project
  const project = action.payload;
  // 查询索引，如果包含 project.id，那就直接返回原有的 state，不需要添加
  if (state.entities[project.id]) {
    return state;
  }
  // 如果不存在，就可以新增，添加 id 和 对应 id 的 project
  const ids = [...state.ids, project.id];
  const entities = { ...state.entities, [project.id]: project };
  // 返回新的状态
  return { ...state, ids: ids, entities: entities };
};

const delProject = (state, action) => {
  const project = action.payload;
  // filter 操作符返回的还是一个新的数组
  const ids = state.ids.filter(id => id !== project.id);
  if (ids.length === 0) {
    return state;
  }
  const newEntities = buildObjFromArr(ids, state.entities);
  return {
    ids: ids,
    entities: newEntities,
    selectedId: project.id === state.selectedId ? null : state.selectedId
  };
};

const updateProject = (state, action) => {
  const project = action.payload;
  // 利用 ... 语法，如果不存在则新增，存在的话则更新
  const entities = { ...state.entities, [project.id]: project };
  return { ...state, entities: entities };
};

const loadProjects = (state, action) => {
  const projects = action.payload;
  if (projects === null) {
    return state;
  }
  const newProjects = projects.filter(project => !state.entities[project.id]);
  // 转为 project.id 数组
  const newIds = newProjects.map(project => project.id);
  if (newProjects.length === 0) {
    return state;
  }
  const newEntities = covertArrToObj(newProjects);
  return {
    ids: [...state.ids, ...newIds],
    entities: { ...state.entities, ...newEntities },
    selectedId: null
  };
};

export function reducer(state = initialState, action: actions.Actions): State {
  switch (action.type) {
    case actions.ActionTypes.ADD_SUCCESS:
      return addProject(state, action);
    case actions.ActionTypes.DELETE_SUCCESS:
      return delProject(state, action);
    case actions.ActionTypes.INVITE_SUCCESS:
    case actions.ActionTypes.UPDATE_LISTS_SUCCESS:
    case actions.ActionTypes.UPDATE_SUCCESS:
      return updateProject(state, action);
    case actions.ActionTypes.LOADS_SUCCESS:
      return loadProjects(state, action);
    case actions.ActionTypes.SELECT:
      return { ...state, selectedId: action.payload.id };
    default:
      return state;
  }
}

// 取二级参数
export const getEntities = (state) => state.entities;
export const getSelectedId = (state) => state.selectedId;
export const getIds = (state) => state.ids;
export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

// 得到所有的 project，把它们封装成一个数组
export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
