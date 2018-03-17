import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MdDialog } from '@angular/material'
import { NewTaskComponent } from '../new-task/new-task.component';
import { CopyTaskComponent } from '../copy-task/copy-task.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component'
import { NewTaskListComponent } from '../new-task-list/new-task-list.component';
import { slideToRight } from '../../anims/router.anim'

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
  animations: [
    slideToRight
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHomeComponent implements OnInit {
  
  @HostBinding('@routeAnim') state;

  public lists: any[] = [
    {
      id: 1,
      name: "待办",
      order: 1,
      tasks: [
        {
          id: 1,
          desc: "任务一：买咖啡",
          completed: true,
          priority: 3,
          owner: {
            id: 1,
            name: "张三",
            avatar: "/assets/1.jpg"
          },
          dueDate: new Date(),
          reminder: new Date
        },
        {
          id: 2,
          desc: "任务二：买两杯咖啡",
          completed: false,
          priority: 2,
          owner: {
            id: 1,
            name: "李四",
            avatar: "/assets/1.jpg"
          },
          dueDate: new Date()
        }
      ]
    },
    {
      id: 2,
      name: "进行中",
      order: 2,
      tasks: [
        {
          id: 1,
          desc: "任务三：买三杯咖啡",
          completed: false,
          priority: 1,
          owner: {
            id: 1,
            name: "王五",
            avatar: "/assets/1.jpg"
          },
          dueDate: new Date()
        },
        {
          id: 2,
          desc: "任务四：买四杯咖啡",
          completed: false,
          priority: 2,
          owner: {
            id: 1,
            name: "赵六",
            avatar: "/assets/1.jpg"
          },
          dueDate: new Date()
        }
      ]
    }
    
  ]

  constructor(private dialog: MdDialog, private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  launchNewTaskDialog() {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      data: {
        title: '新建任务'
      }
    })
  }

  launchCopyTaskDialog() {
    const dialogRef = this.dialog.open(CopyTaskComponent, {
      data: { lists: this.lists }
    })
  }

  launchUpdateTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      data: {
        title: '修改任务',
        task: task
      }
    })
  }

  launchConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除列表',
        content: '确认删除该列表？'
      }
    });
  }

  launchEditListDialog() {
    const dialogRef = this.dialog.open(NewTaskListComponent, {
      data: {
        title: '更改列表名称'
      }
    });
  }

  launchNewListDialog() {
    const dialogRef = this.dialog.open(NewTaskListComponent, {
      data: {
        title: '新建列表'
      }
    });
  }

  // srcData 为拖拽对象
  // list 为目标对象
  handleMove(srcData, list) {
    switch (srcData.tag) {
      case 'task-item':
        console.log('handling item')
        break;
    
      case 'task-list':
        console.log('handling list')
        console.log(srcData)
        console.log(list)
        const srcList = srcData.data;
        const tempOrder = srcList.order;
        srcList.order = list.order;
        list.order = tempOrder;
        break;
      default:
        break;
    }
  }

  handleQuickTask(desc: string) {
    console.log(desc);
  }

}
