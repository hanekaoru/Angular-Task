import { Component, Input, forwardRef, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { 
  ControlValueAccessor, 
  NG_VALUE_ACCESSOR, 
  NG_VALIDATORS, 
  FormControl, 
  FormBuilder, 
  FormGroup 
} from '@angular/forms';
import { IdentityType, Identity } from '../../domain';
import { Subject, Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable'


@Component({
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef( () => IdentityInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef( () => IdentityInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentityInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  identityTypes = [
    {
      value: IdentityType.IdCard,
      label: '身份证'
    },
    {
      value: IdentityType.Insurance,
      label: '医保'
    },
    {
      value: IdentityType.Militay,
      label: '军官证'
    },
    {
      value: IdentityType.Passport,
      label: '护照'
    },
    {
      value: IdentityType.Other,
      label: '其他'
    }
  ]

  // 一个成员变量，用来维护自己内部的值
  identity: Identity = { identityType: null, identityNo: null };
  private _idType = new Subject<IdentityType>()
  private _idNo = new Subject<string>()

  private propagateChange = (_: any) => {}
  private sub: Subscription;

  constructor() { }

  ngOnInit() {
    // 将 _idType 和 _idNo 两个流进行合并
    const val$ = Observable.combineLatest(this.idNo, this.idType, (_no, _type) => {
      // 返回一个 identityType 类型的值
      return {
        identityType: _type,
        identityNo: _no
      }
    })

    // 然后我们可以去订阅它
    this.sub = val$.subscribe(id => {
      this.propagateChange(id);
    })
  }
  
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe
    }
  }

  writeValue(obj: any): void {
    if (obj) {
      this.identity = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  // 模版当中的两个方法
  onIdTypeChange(idType: IdentityType) {
    // 每次点击下拉框的时候将 idType 发射出去
    this._idType.next(idType);
  }

  onIdNoChange(idNo: string) {
    // idNo 变化的时候也会发射一个
    this._idNo.next(idNo);
  }

  // 定义两个 get 方法
  // Subject 既可以作为输出 next() 出来
  // 也可以作为 接收者
  get idType(): Observable<IdentityType> {
    return this._idType.asObservable();
  }

  get idNo(): Observable<string> {
    return this._idNo.asObservable();
  }

  // 表单验证
  validate(c: FormControl): {[key: string]: any} {
    const val = c.value;
    if (!val) {
      return null;
    }

    switch (val.identityType) {
      case IdentityType.IdCard: {
        return this.validateIdCard(c);
      }
      case IdentityType.Passport: {
        return this.validatePassport(c);
      }
      case IdentityType.Militay: {
        return this.validateMilitay(c);
      }
      case IdentityType.Insurance:  
      default:
        return null;
    }
  }

  // 验证身份证
  validateIdCard(c: FormControl): {[key: string]: any} {
    const val = c.value.identityNo;
    if (val.length !== 18) {
      return {idInvalid: true}
    }
    const pattern = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[x0-9]$/
    return pattern.test(val) ? null : {idNotValid: true}
  }

  // 验证护照
  validatePassport(c: FormControl): {[key: string]: any} {
    const val = c.value.identityNo;
    if (val.length !== 9) {
      return {idInvalid: true}
    }
    const pattern = /^[GgEe]\d{8}$/
    return pattern.test(val) ? null : {idNotValid: true}
  }

  // 验证军官证
  validateMilitay(c: FormControl): {[key: string]: any} {
    const val = c.value.identityNo;
    const pattern = /[\u4e00-\u9fa5](字第)(\d{4,8})(号?)$/
    return pattern.test(val) ? null : {idNotValid: true}
  }



}
