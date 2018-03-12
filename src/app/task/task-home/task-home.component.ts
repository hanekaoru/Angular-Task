import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss']
})
export class TaskHomeComponent implements OnInit {

  public lists: any[] = [
    {
      id: 1,
      name: "待办",
      tasks: [
        {
          id: 1,
          desc: "任务一：买咖啡",
          owner: {
            id: 1,
            name: "张三",
            avatar: "/assets/1.jpg",
            dueDate: new Date()
          }
        },
        {
          id: 2,
          desc: "任务二：买两杯咖啡",
          owner: {
            id: 1,
            name: "李四",
            avatar: "/assets/1.jpg",
            dueDate: new Date()
          }
        }
      ]
    },
    {
      id: 1,
      name: "进行中",
      tasks: [
        {
          id: 1,
          desc: "任务三：买三杯咖啡",
          owner: {
            id: 1,
            name: "王五",
            avatar: "/assets/1.jpg",
            dueDate: new Date()
          }
        },
        {
          id: 2,
          desc: "任务四：买四杯咖啡",
          owner: {
            id: 1,
            name: "赵六",
            avatar: "/assets/1.jpg",
            dueDate: new Date()
          }
        }
      ]
    }
    
  ]

  constructor() { }

  ngOnInit() {
  }

}
