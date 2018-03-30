export const covertArrToObj = (arr) => {
  return arr.reduce((entities, obj) => ({ ...entities, [obj.id]: obj }), {});
};

// 利用数组的 reduce 方法
// 第一个参数是一个函数性参数，第二个参数是一个初始值
// 把前一个对象进行展开，然后根据新的 id 不断的进行叠加，构造成一个新的对象
// 初始值为 {}，arr 中有多少个值，后面就会运行多少次，id 就是当前数组当中的元素
export const buildObjFromArr = (arr, dict) => {
  return arr.reduce((entities, id) => ({ ...entities, [id]: dict[id] }), {});
};

export const loadCollection = (state, collection) => {
  const newItems = collection.filter(item => !state.entities[item.id]);
  const newIds = newItems.map(item => item.id);
  const newEntities = covertArrToObj(newItems);
  return {
    ids: [...state.ids, ...newIds],
    entities: { ...state.entities, ...newEntities }
  };
};

export const updateOne = (state, updated) => {
  const entities = { ...state.entities, [updated.id]: updated };
  return { ...state, entities: entities };
};

export const deleteOne = (state, deleted) => {
  const newIds = state.ids.filter(id => id !== deleted.id);
  const newEntities = buildObjFromArr(newIds, state.entities);
  return { ids: newIds, entities: newEntities }
};

export const addOne = (state, added) => {
  const newIds = [...state.ids, added.id];
  const newEntities = { ...state.entities, [added.id]: added };
  return { ids: newIds, entities: newEntities };
};
