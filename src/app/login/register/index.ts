import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/auth.action';
import { extractInfo, getAddrByCode, isValidAddr } from '../../utils/identity.util';
import { isValidDate, toDate } from '../../utils/date.util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy {

  selectedTab = 0;
  form: FormGroup;
  avatars$: Observable<string[]>;
  private _sub: Subscription;
  private readonly avatarName = 'avatars';

  constructor(private fb: FormBuilder,
    private store$: Store<fromRoot.State>) {

    this.avatars$ = Observable
      .range(1, 16)
      .map(i => `${this.avatarName}:svg-${i}`)
      .reduce((r, x) => [...r, x], []);
  }

  ngOnInit() {
    const img = `${this.avatarName}:svg-${(Math.random() * 16).toFixed()}`;
    this.form = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      repeat: ['', Validators.required],
      avatar: [img],
      dateOfBirth: [''],
      address: ['', Validators.maxLength(80)],
      identity: []
    });

    // 自定义的表单控件和普通的表单控件是一样的，都可以通过 valueChanges 得到这个流
    // 然后在验证通过的时候才会把数据放出来
    // 然后我们可以去订阅这个流，从身份证的信息当中读取出生日和地址，然后 set 到其他两个控件当中
    const id$ = this.form.get('identity').valueChanges
      .debounceTime(300)
      .filter(v => this.form.get('identity').valid);

    this._sub = id$.subscribe(id => {
      // 通过 extractInfo() 方法提取身份证当中有用的信息
      const info = extractInfo(id.identityNo);
      // 判断地址码是否正确，然后去 set form 表单当中地址部分
      if (isValidAddr(info.addrCode)) {
        const addr = getAddrByCode(info.addrCode);
        this.form.patchValue({ address: addr });
        this.form.updateValueAndValidity({ onlySelf: true, emitEvent: true });
      }
      // 生日的判断作用同上
      if (isValidDate(info.dateOfBirth)) {
        const date = info.dateOfBirth;
        this.form.patchValue({ dateOfBirth: date });
        this.form.updateValueAndValidity({ onlySelf: true, emitEvent: true });
      }
    });
  }

  ngOnDestroy() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  onSubmit({ value, valid }, e: Event) {
    e.preventDefault();
    if (!valid) {
      return;
    }
    this.store$.dispatch(
      new actions.RegisterAction({
        password: value.password,
        name: value.name,
        email: value.email,
        avatar: value.avatar,
        identity: value.identity,
        address: value.address,
        dateOfBirth: value.dateOfBirth
      }));
  }

  prevTab() {
    this.selectedTab = 0;
  }

  nextTab() {
    this.selectedTab = 1;
  }

  onTabChange(index) {
    this.selectedTab = index;
  }
}
