import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component'

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  public projects: any[] = [
    {
      "name": "张三",
      "desc": "内部项目",
      "coverImg": "assets/1.jpg"
    },
    {
      "name": "李四",
      "desc": "外部项目",
      "coverImg": "assets/1.jpg"
    }
  ]

  constructor(private dialog: MdDialog) { }

  ngOnInit() {
  }

  openNewProjectDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        dark: true
      }
    });
    // 接收回传的数据
    dialogRef.afterClosed().subscribe(data => console.log(data))
  }

  launchInviteDialog() {
    this.dialog.open(InviteComponent)
  }

}
