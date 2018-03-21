import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MdDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component'
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../anims/router.anim';
import { listAnimation } from '../../anims/list.anim'
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight,
    listAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {

  @HostBinding('@routeAnim') state;

  projects;

  constructor(
    private dialog: MdDialog, 
    private cd: ChangeDetectorRef,
    private service$: ProjectService
  ) { }

  ngOnInit() {
    this.service$.get("1").subscribe(project => this.projects = project)
  }

  openNewProjectDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        title: '新增项目'
      }
    });
    // 接收回传的数据
    dialogRef.afterClosed().subscribe(data => {
      console.log(data)
      this.projects = [...this.projects, {
        id: 3,
        name: '赵六',
        desc: '一个新项目',
        coverImg: 'assets/1.jpg'
      }, {
        id: 4,
        name: '王五',
        desc: '又一个新项目',
        coverImg: 'assets/1.jpg'
      }];
      this.cd.markForCheck();
    })
  }

  launchInviteDialog() {
    this.dialog.open(InviteComponent)
  }

  launchUpdateDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        title: '编辑项目'
      }
    });
  }

  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除项目',
        content: '确认删除该项目？'
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      console.log(data)
      this.projects = this.projects.filter(item => item.id !== project.id);
      this.cd.markForCheck();
    })
  }

}
