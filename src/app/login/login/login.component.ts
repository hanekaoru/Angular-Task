import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  // form 名称可以自行定义
  form: FormGroup;
  constructor(private fb: FormBuilder) { }

  // 初始化
  ngOnInit() {
    this.form = this.fb.group({
      email: ['zhangsan@126.com', Validators.compose([
        Validators.required,
        Validators.email,
        this.validate
      ])],
      password: ['', Validators.required]
    })
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    console.log(value)
  }

  validate(c: FormControl): {[key: string]: any} {
    if (!c.valid) {
      return null;
    }
    if (/^qq+/g.test(c.value)) {
      return null;
    }
    return {
      emailErrorMsg: '需要以qq开头'
    }
  }

}
