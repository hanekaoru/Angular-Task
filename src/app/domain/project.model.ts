export interface Project {
  id?: string;
  name: string;
  desc?: string;
  coverImg: string;
  taskList?: string[]; // 列表 id
  members?: string[];  // 成员 id
}