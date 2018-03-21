export interface Task {
  id?: string;
  desc: string;
  completed: boolean;
  priority: number;
  dueDate?: Date;
  reminder?: Date;
  remark?: string;
  crateDate: Date;
  ownerId?: string;         // 执行者只有一个
  participantIds: string[]; // 参与者可以有多个
  taskListId: string;
}