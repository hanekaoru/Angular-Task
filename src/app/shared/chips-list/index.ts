import { ChangeDetectionStrategy, Component, OnInit, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../services';
import { User } from '../../domain';

@Component({
  selector: 'app-chips-list',
  template: `
    <div [formGroup]="chips" class="full-width">
      <span>{{label}}</span>
      <md-chip-list>
        <md-chip color="primary" selected="true" *ngFor="let member of items">
          {{member.name}} <span (click)="removeMember(member)" class="remove-tag">x</span>
        </md-chip>
      </md-chip-list>
      <md-input-container *ngIf="displayInput" class="full-width">
        <input mdInput [placeholder]="placeholderText" [mdAutocomplete]="autoMember" formControlName="memberSearch">
      </md-input-container>
    </div>
    <md-autocomplete #autoMember="mdAutocomplete" [displayWith]="displayUser">
      <md-option
        *ngFor="let item of memberResults$ | async"
        [value]="item"
        (onSelectionChange)="handleMemberSelection(item)">
        {{item.name}}
      </md-option>
    </md-autocomplete>
  `,
  styles: [`
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsListComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipsListComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsListComponent implements ControlValueAccessor, OnInit {

  // fix the lint complaints about using a reference in template
  // It seems tslint requires now that a `@ViewChild` need to be declared
  // 'you are using blablabla that you're trying to access does not exist in the class declaration.'
  @ViewChild('autoMember') autoMember;

  // 用于指定参与人或者执行人（一个可以有多个，一个只能有一个）
  @Input() multiple = true;
  @Input() label = '添加/修改成员';
  @Input() placeholderText = '请输入成员 email';
  items: User[];
  chips: FormGroup;

  // 利用 async pipe
  // 直接在本地定义一个流
  memberResults$: Observable<User[]>;

  constructor(private fb: FormBuilder, private service: UserService) {
    this.items = [];
  }

  ngOnInit() {
    this.chips = this.fb.group({
      memberSearch: ['']
    });

    // 然后让本地这个流等于我们组合后的流，然后在 html 模版当中便可以直接使用
    // 不需要再去什么声明一个变量，来等于 subscribe 的值等操作
    // 通过输入来得到一系列提示的值（流），这里通过 valueChanges 来获取
    this.memberResults$ = this.searchUsers(this.chips.controls['memberSearch'].valueChanges);
  }

  // 这里是做一个空函数体，真正使用的方法在 registerOnChange 中
  // 由框架注册，然后我们使用它把变化发回表单
  // 注意，和 EventEmitter 尽管很像，但发送回的对象不同
  private propagateChange = (_: any) => { };

  // 设置初始值
  // 接收的是一个 User 数组
  public writeValue(obj: User[]) {
    // 如果是多个值
    if (obj && this.multiple) {
      // 将数组转为字典对象
      const userEntities = obj.reduce((entities, user) => {
        return { ...entities, [user.id]: user };
      }, {});
      // 如果自己维护的 items 不为空的话
      if (this.items) {
        // 和传入的数组进行对比判断，看不重合的项有哪些
        const remaining = this.items.filter(item => !userEntities[item.id]);
        // 然后将两者合并，取并集
        this.items = [...remaining, ...obj];
      }
    } else if (obj && !this.multiple) {
      this.items = [...obj];
    }
  }

  // 当表单控件值改变时，函数 fn 会被调用
  // 这也是我们把变化 emit 回表单的机制
  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  // 验证表单，验证结果正确返回 null 否则返回一个验证结果对象
  public validate(c: FormControl) {
    // 如果有值，就 OK，否则返回错误消息
    return this.items ? null : {
      chipListInvalid: {
        valid: false,
      },
    };
  }

  // 这里没有使用，用于注册 touched 状态
  public registerOnTouched() { }

  removeMember(member: User) {
    // 映射成一个 id 数组
    const ids = this.items.map(u => u.id);
    // 需要删除的项在数组当中所处的位置
    const i = ids.indexOf(member.id);
    // 同样的判断是否是多个值
    if (this.multiple) {
      // 删除掉指定项
      this.items = [...this.items.slice(0, i), ...this.items.slice(i + 1)];
    } else {
      this.items = [];
    }
    this.chips.patchValue({ memberSearch: '' });
    this.propagateChange(this.items);
  }

  // 添加成员到数组当中
  handleMemberSelection(user: User) {
    // 如果当前维护的 id 数组中包含了 member.id 的话，则什么都不做，直接返回
    if (this.items.map(u => u.id).indexOf(user.id) !== -1) {
      return;
    }
    // 如果有多个值的话，就将 member 添加进去，否则则只有 member 一项
    if (this.multiple) {
      this.items = [...this.items, user];
    } else {
      this.items = [user];
    }
    this.chips.patchValue({ memberSearch: user.name });
    this.propagateChange(this.items);
  }

  // 处理 input 框内显示的值，点击自动完成的列表项后输入框内显示的值
  displayUser(user: User): string {
    return user ? user.name : '';
  }

  searchUsers(obs: Observable<string>): Observable<User[]> {
    return obs.startWith('')
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(s => s && s.length > 1)
      .switchMap(str => this.service.searchUsers(str));
  }

  // 处理什么时候显示 input 输入框
  get displayInput() {
    // 除非 multiple 为 false 或者 length 不为零
    return this.multiple || (this.items.length === 0);
  }
}
