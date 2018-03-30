import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { User } from '../../domain';

@Component({
  selector: 'app-invite',
  template: `
    <h2 md-dialog-title>{{dialogTitle}}</h2>
    <form class="full-width" #f="ngForm" (ngSubmit)="onSubmit($event, f)">
      <app-chips-list [label]="'邀请成员'" name="members" [(ngModel)]="members">
      </app-chips-list>
      <div md-dialog-actions>
        <button md-raised-button color="primary" type="submit" [disabled]="!f.valid">
          保存
        </button>
        <button md-dialog-close md-raised-button type="button">关闭</button>
      </div>
    </form>
    `,
  styles: [``]
})
export class InviteComponent implements OnInit {

  members: User[] = [];
  dialogTitle: string;

  constructor(
    @Inject(MD_DIALOG_DATA) private data: any,
    private dialogRef: MdDialogRef<InviteComponent>
  ) { }

  // 初始化的时候传递 this.data.members 进来，该数据是项目中现有成员的一个列表
  // 会显示为 chips（下拉），点击后加入到这个列表当中
  // this.members 为现有的成员列表
  // this.data.members 自动输入时加入的
  // 为了使 this.data.members 是一个新数组，使用 ... 
  ngOnInit() {
    this.members = [...this.data.members];
    this.dialogTitle = this.data.dialogTitle ? this.data.dialogTitle : '邀请成员';
  }

  onSubmit(ev: Event, { value, valid }) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close(this.members);
  }
}
