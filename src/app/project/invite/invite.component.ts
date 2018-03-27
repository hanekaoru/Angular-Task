import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material'
import { User } from '../../domain';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteComponent implements OnInit {

  members: User[] = [];
  constructor(
    @Inject(MD_DIALOG_DATA) private data,
    private dialogRef: MdDialogRef<InviteComponent>
  ) { }

  ngOnInit() {
    // 初始化的时候传递 this.data.members 进来，该数据是项目中现有成员的一个列表
    // 会显示为 chips（下拉），点击后加入到这个列表当中
    // this.members 为现有的成员列表
    // this.data.members 自动输入时加入的
    // 为了使 this.data.members 是一个新数组，使用 ... 
    this.members = [...this.data.members]
  }

  onSubmit(ev: Event, {valid, value}) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close(this.members);
  }

}
