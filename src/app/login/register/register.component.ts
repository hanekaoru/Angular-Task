import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import { isValidDate } from '../../utils/date.util';
import { Subscription } from 'rxjs';
import { getAddrByCode, isValidAddr, extractInfo } from '../../utils/identity.util'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy {

  public items: string[] = [
    'assets/avatar/01.jpg',
    'assets/avatar/02.jpg',
    'assets/avatar/03.jpg',
    'assets/avatar/04.jpg'
  ];
  form: FormGroup;
  sub: Subscription;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: [],
      name: [],
      password: [],
      repeat: [],
      avatar: ['assets/1.jpg'],
      dateOfBirth: ['1990-01-01'],
      address: [],
      identity: []
    })

    // 自定义的表单控件和普通的表单控件是一样的，都可以通过 valueChanges 得到这个流
    // 然后在验证通过的时候才会把数据放出来
    // 然后我们可以去订阅这个流，从身份证的信息当中读取出生日和地址，然后 set 到其他两个控件当中
    const id$ = this.form.get('identity').valueChanges
      .debounceTime(300)
      .filter(_ => this.form.get('identity').valid);
    this.sub = id$.subscribe(id => {
      // 通过 extractInfo() 方法提取身份证当中有用的信息
      const info = extractInfo(id.identityNo)
      // 判断地址码是否正确，然后去 set form 表单当中地址部分
      if (isValidAddr(info.addrCode)) {
        const addr = getAddrByCode(info.addrCode);
        this.form.get('address').patchValue(addr);
      }
      // 生日的判断作用同上
      if (isValidDate(info.dateOfBirth)) {
        this.form.get('dateOfBirth').patchValue(info.dateOfBirth)
      }

    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    console.log(value);
  }

}
