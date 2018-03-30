import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/project.action';
import { NewProjectComponent } from '../new-project';
import { InviteComponent } from '../invite';
import { ConfirmDialogComponent } from '../../shared';
import { defaultRouteAnim, listAnimation } from '../../anim';
import { Project } from '../../domain';

@Component({
  selector: 'app-project-list',
  template: `
    <div class="container" [@listAnim]="listAnim$ | async">
      <app-project-item
        class="card"
        *ngFor="let project of (projects$ | async)"
        [item]="project"
        (itemSelected)="selectProject(project)"
        (launchUpdateDialog)="openUpdateDialog(project)"
        (launchInviteDailog)="openInviteDialog(project)"
        (launchDeleteDailog)="openDeleteDialog(project)">
      </app-project-item>
    </div>
    <button md-fab (click)="openNewProjectDialog()" type="button" class="fab-button">
      <md-icon>add</md-icon>
    </button>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .card {
      height: 360px;
      flex: 0 0 360px;
      margin: 10px;
      display: flex;
    }
    .fab-button {
      position: fixed;
      right: 32px;
      bottom: 96px;
      z-index: 998;
    }
  `],
  animations: [defaultRouteAnim, listAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent {

  @HostBinding('@routeAnim') state;
  projects$: Observable<Project[]>;
  listAnim$: Observable<number>;

  constructor(
    private store$: Store<fromRoot.State>,
    private dialog: MdDialog
  ) {
    // 首先发射加载
    this.store$.dispatch(new actions.LoadProjectsAction({}));
    this.projects$ = this.store$.select(fromRoot.getProjects);
    this.listAnim$ = this.projects$.map(p => p.length);
  }

  selectProject(project: Project) {
    this.store$.dispatch(new actions.SelectProjectAction(project));
  }

  openNewProjectDialog() {
    const img = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const thumbnails$ = this.getThumbnailsObs();
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { thumbnails: thumbnails$, img: img } });
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
      // .filter(n => n)
      // 对象展开，如果前面的属性有的话，就去更新，没有的话则就去添加
      // .map(val => ({
      //   ...val,
      //   coverImg: this.buildImgSrc(val.coverImg)
      // }))
      // add 方法返回的也是一个流，如果这个流不进行订阅，还是没有效果的
      // // 最简单的解决方式就是后面直接 .subscribe()
      // // 但是一般尽量不在 subscribe() 当中再次 subscribe()
      // // 所以这里采用合并的方式
      // // 因为在 switchMap 当中需要使用 service
      // // 调用 service 后返回的还是一个流，所以需要进行拍扁操作 

      // // 如果服务中返回的是一个流的话，在某些方法当中想直接调用是没有效果的
      // // 因为流的话是一定需要订阅的
      // // 所以这里的操作是和另外一个流进行合并了之后在去进行订阅
      // .switchMap(v => this.service$.add(v))
      .subscribe(val => {
        if (val) {
          const converImg = this.buildImgSrc(val.coverImg);
          this.store$.dispatch(new actions.AddProjectAction({ ...val, coverImg: converImg }));
        }
      });
  }

  openUpdateDialog(project) {
    const thumbnails$ = this.getThumbnailsObs();
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { project: project, thumbnails: thumbnails$ } });
    dialogRef.afterClosed().take(1).subscribe(val => {
      if (val) {
        const converImg = this.buildImgSrc(val.coverImg);
        this.store$.dispatch(new actions.UpdateProjectAction({ ...val, id: project.id, coverImg: converImg }));
      }
    });
  }

  openInviteDialog(project) {
    let members = [];
    this.store$.select(fromRoot.getProjectMembers(project.id))
      .take(1)
      .subscribe(m => members = m);
    const dialogRef = this.dialog.open(InviteComponent, { data: { members: members } });
    // 使用 take(1) 来自动销毁订阅，因为 take(1) 意味着接收到 1 个数据后就完成了
    dialogRef.afterClosed().take(1).subscribe(val => {
      if (val) {
        this.store$.dispatch(new actions.InviteMembersAction({ projectId: project.id, members: val }));
      }
    });
  }

  openDeleteDialog(project) {
    const confirm = {
      title: '删除项目：',
      content: '确认要删除该项目？',
      confirmAction: '确认删除'
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { dialog: confirm } });

    // 使用 take(1) 来自动销毁订阅，因为 take(1) 意味着接收到 1 个数据后就完成了
    dialogRef.afterClosed().take(1).subscribe(val => {
      if (val) {
        this.store$.dispatch(new actions.DeleteProjectAction(project));
      }
    });
  }

  private getThumbnailsObs(): Observable<string[]> {
    return Observable
      .range(0, 40)
      .map(i => `/assets/img/covers/${i}_tn.jpg`)
      .reduce((r, x) => {
        return [...r, x];
      }, []);
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_', 1)[0] + '.jpg' : img;
  }
}
