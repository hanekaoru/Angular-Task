import { 
  Component, 
  OnInit, 
  OnDestroy,
  HostBinding, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef 
} from '@angular/core';
import { MdDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component'
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../anims/router.anim';
import { listAnimation } from '../../anims/list.anim'
import { ProjectService } from '../../services/project.service';
import * as _ from 'lodash'
import { Project } from '../../domain';
import { Subscription } from 'rxjs';


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
export class ProjectListComponent implements OnInit, OnDestroy {

  @HostBinding('@routeAnim') state;

  projects;
  sub: Subscription;

  constructor(
    private dialog: MdDialog, 
    private cd: ChangeDetectorRef,
    private service$: ProjectService
  ) { }

  ngOnInit() {
    this.sub = this.service$.get("1").subscribe(project => {
      this.projects = project,
      this.cd.markForCheck();
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  openNewProjectDialog() {
    const selectdImg = `/assets/covers/${Math.floor(Math.random() * 4)}_tn.jpg`
    const dialogRef = this.dialog.open(
      NewProjectComponent, 
      {
        data: {
          thumbnails: this.getThumbnails(), 
          img: selectdImg
        }
      }
    );
    // 接收回传的数据，分为两种情况，一直为直接关闭，另外一种是有传值的关闭
    // 所以 filter 一下，确保里面是有值的
    dialogRef.afterClosed()
    // 释放订阅，类似于 this.sub.unsubscribe() 
    // 因为在 dialog 这种情况下可以直接使用 take(1)
    // 因为这个流是在 dialog 关闭的时候才会发射出来
    // 所以在关闭的时候，使用 take(1) 去获取第一个元素即可，这时流就变成了 Completed -
    // 也就是自动取消订阅了
    .take(1)
    // 接收一个表达式，如果表达式什么都不写的话，表示布尔值为真，或者非空
    .filter(n => n)
    // 对象展开，如果前面的属性有的话，就去更新，没有的话则就去添加
    .map(val => ({
      ...val,
      coverImg: this.buildImgSrc(val.coverImg)
    }))
    // add 方法返回的也是一个流，如果这个流不进行订阅，还是没有效果的
    // 最简单的解决方式就是后面直接 .subscribe()
    // 但是一般尽量不在 subscribe() 当中再次 subscribe()
    // 所以这里采用合并的方式
    // 因为在 switchMap 当中需要使用 service
    // 调用 service 后返回的还是一个流，所以需要进行拍扁操作 

    // 如果服务中返回的是一个流的话，在某些方法当中想直接调用是没有效果的
    // 因为流的话是一定需要订阅的
    // 所以这里的操作是和另外一个流进行合并了之后在去进行订阅
    .switchMap(v => this.service$.add(v))
    .subscribe(project => {
      this.projects = [...this.projects, project]
      this.cd.markForCheck();
    })
  }

  launchInviteDialog() {
    this.dialog.open(InviteComponent)
  }

  launchUpdateDialog(project: Project) {
    const dialogRef = this.dialog.open(
      NewProjectComponent, 
      {
        data: {
          thumbnails: this.getThumbnails(),
          project: project
        }
      }
    );
    dialogRef.afterClosed()
    .take(1)
    .filter(n => n)
    .map(val => ({
      ...val,
      // form 表单回传回来的值是没有 id 的
      id: project.id,
      coverImg: this.buildImgSrc(val.coverImg)
    }))
    .switchMap(v => this.service$.update(v))
    .subscribe(project => {
      // 获取当前的位置
      // projects 是一个对象，无法使用 projects.indexOf(project) 去定位
      // 所以利用 project.id 去定位当前位置
      const index = this.projects.map(p => p.id).indexOf(project.id);
      this.projects = [
        ...this.projects.slice(0, index),
        project,
        ...this.projects.slice(index + 1)
      ]
      this.cd.markForCheck();
    })
  }

  launchConfirmDialog(project) {
    // ConfirmDialog 会返回一个布尔值
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除项目',
        content: '确认删除该项目？'
      }
    });
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      // 使用 switchMap，因为并不关心对话框返回的值，而是需要获取传递过来的值
      .switchMap(_ => this.service$.del(project))
      .subscribe(prj => {
        this.projects = this.projects.filter(item => item.id !== prj.id);
        this.cd.markForCheck();
      })
  }

  // 获取缩略图
  private getThumbnails() {
    return _.range(0, 4)
      .map(i => `/assets/covers/${i}_tn.jpg`)
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }

}
