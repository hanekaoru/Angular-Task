import { Component, Input, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { 
  ControlValueAccessor, 
  NG_VALUE_ACCESSOR, 
  NG_VALIDATORS, 
  FormControl, 
  FormBuilder, 
  FormGroup 
} from '@angular/forms';
import { User } from '../../domain';
import { Observable } from 'rxjs/Rx'
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chips-list',
  templateUrl: './chips-list.component.html',
  styleUrls: ['./chips-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef( () => ChipsListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef( () => ChipsListComponent),
      multi: true
    }
  ]
})
export class ChipsListComponent implements ControlValueAccessor {

  // 用于指定参与人或者执行人（一个可以有多个，一个只能有一个）
  @Input() multiple = true;

  @Input() placeholderText = '请输入成员 email';
  @Input() label = '添加/修改成员';
  form: FormGroup;
  items: User[] = [];

  // 利用 async pipe
  // 直接在本地定义一个流
  memberRestlts$: Observable<User[]>;


  constructor(
    private fb: FormBuilder,
    private service$: UserService
  ) { }

  public propagateChange = (_: any) => {}

  ngOnInit() {
    this.form = this.fb.group({
      memberSearch: ['']
    })

    // 然后让本地这个流等于我们组合后的流，然后在 html 模版当中便可以直接使用
    // 不需要再去什么声明一个变量，来等于 subscribe 的值等操作
    // 通过输入来得到一系列提示的值（流），这里通过 valueChanges 来获取
    this.memberRestlts$ = this.form.get('memberSearch').valueChanges

      .debounceTime(300)
      .distinctUntilChanged()
      // 对于得到的值进行过滤，不为空并且长度大于 1
      .filter(s => s && s.length > 1)
      // 利用 UserService 进行处理，返回的就是一个 Observable 数组
      .switchMap(str => this.service$.serachUsers(str))
  }

  // 接收的是一个 User 数组
  writeValue(obj: User[]): void {
    // 如果是多个值
    if (obj && this.multiple) {
      // 将数组转为字典对象
      const userEntities = obj.reduce((el, c) => ({...el, c}), {})

      // 如果自己维护的 items 不为空的话
      if (this.items) {
        // 和传入的数组进行对比判断，看不重合的项有哪些
        const remaining = this.items.filter(item => !userEntities[item.id])
        // 然后将两者合并，取并集
        this.items = [...remaining, ...obj];
      }
    } else if (obj && !this.multiple) {
      this.items = [...obj];
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  validate(c: FormControl): {[key: string]: any} {
    // 如果有值，就 OK，否则返回错误消息
    return this.items ? null : {
      chipListInvalid: true
    }
  }

  removeMember(member: User) {
    // 映射成一个 id 数组
    const ids = this.items.map(item => item.id);
    // 需要删除的项在数组当中所处的位置
    const i = ids.indexOf(member.id);
    // 同样的判断是否是多个值
    if (this.multiple) {
      // 删除掉指定项
      this.items = [...this.items.slice(0, i), ...this.items.slice(i + 1)]
    } else {
      this.items = [];
    }
    this.form.patchValue({memberSearch: ''});
    this.propagateChange(this.items);
  }

  // 添加成员到数组当中
  handleMembersSelection(member: User) {
    
    // 如果当前维护的 id 数组中包含了 member.id 的话，则什么都不做，直接返回
    if (this.items.map(item => item.id).indexOf(member.id) !== -1) {
      return;
    }
    // 如果有多个值的话，就将 member 添加进去，否则则只有 member 一项
    this.items = this.multiple ? [...this.items, member] : [member];
    this.form.patchValue({memberSearch: member.email});
    this.propagateChange(this.items);
  }

  // 处理 input 框内显示的值，点击自动完成的列表项后输入框内显示的值
  displayUser(user: User): string {
    return user ? user.email : '';
  }

  // 处理什么时候显示 input 输入框
  get displayInput() {
    // 除非 multiple 为 false 或者 length 不为零
    return this.multiple || this.items.length === 0;
  }

}
