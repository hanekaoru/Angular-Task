import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProjectComponent implements OnInit {

  public title: string = '';
  coverImages = [];
  form: FormGroup;

  constructor(
    @Inject(MD_DIALOG_DATA) private data, 
    private dialogRef: MdDialogRef<NewProjectComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.coverImages = this.data.thumbnails;
    // 如果传递了 project 就说明是修改
    if (this.data.project) {
      this.form = this.fb.group({
        // 初始值设置为 this.data.project.name，后面设定为必填项
        name: [this.data.project.name, Validators.required],
        desc: [this.data.project.desc],
        coverImg: [this.data.project.coverImg]
      })
      this.title = '修改项目'
    } else {
      // 如果是新增
      this.form = this.fb.group({
        name: ['', Validators.required],
        desc: [],
        coverImg: [this.data.img]
      })
      this.title = '新增项目'
    }
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close(value)
  }

}
