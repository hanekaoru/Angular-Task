import { Component, OnInit, ChangeDetectionStrategy, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getProvinces, getCitiesByProvince, getAreasByCity } from '../../utils/area.util';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Address } from '../../domain';

@Component({
  selector: 'app-area-list',
  template: `
    <div class="address-group">
      <div>
        <md-select
          placeholder="请选择省份"
          [(ngModel)]="_address.province"
          (change)="onProvinceChange()">
          <md-option *ngFor="let p of provinces" [value]="p">
            {{ p }}
          </md-option>
        </md-select>
      </div>
      <div>
        <md-select
          placeholder="请选择城市"
          [(ngModel)]="_address.city"
          (change)="onCityChange()">
          <md-option *ngFor="let c of cities$ | async" [value]="c">
            {{ c }}
          </md-option>
        </md-select>
      </div>
      <div>
        <md-select
          placeholder="请选择区县"
          [(ngModel)]="_address.district"
          (change)="onDistrictChange()">
          <md-option *ngFor="let d of districts$ | async" [value]="d">
            {{ d }}
          </md-option>
        </md-select>
      </div>
      <div class="street">
        <md-input-container class="full-width">
          <input mdInput placeholder="街道地址" [(ngModel)]="_address.street" (change)="onStreetChange()">
        </md-input-container>
      </div>
    </div>
    `,
  styles: [`
    .street{
      flex: 1 1 100%;
    }
    .address-group{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaListComponent implements ControlValueAccessor, OnInit, OnDestroy {
  _address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  };

  // 在数据变化的时候，以 Subject 的形式发送数据
  _province = new Subject<string>();
  _city = new Subject<string>();
  _district = new Subject<string>();
  _street = new Subject<string>();

  // 三个选择框的填充内容
  cities$: Observable<string[]>;
  districts$: Observable<string[]>;
  provinces = getProvinces();

  private _sub: Subscription;
  private propagateChange = (_: any) => { };

  constructor() { }

  // 由于地址是由下面四个部分构成，如果四个流当中有任何一个流发生了变化，就会产生一个新的地址
  // 所以从行为上来说非常类似 combineLatest
  ngOnInit() {

    const province$ = this._province.asObservable().startWith('');
    const city$ = this._city.asObservable().startWith('');
    const district$ = this._district.asObservable().startWith('');
    const street$ = this._street.asObservable().startWith('');

    // 合并多个流，超过两个流以上的话可以使用数组
    const val$ = Observable.combineLatest([province$, city$, district$, street$], (_p, _c, _d, _s) => {
      return {
        province: _p,
        city: _c,
        district: _d,
        street: _s
      };
    });

    // 进行订阅后，将它的值发送出去，让外部知道其变化
    this._sub = val$.subscribe(v => {
      this.propagateChange(v);
    });

    // 关于城市的流，是选择完省份之后，依据选择的省份去对应数据当中去把这个省份对应的城市取回
    // 即 province$，在它改变的时候，可以得到改变的省，利用该省来去得到对应的城市列表
    // 根据省份的选择得到城市列表
    this.cities$ = province$.mergeMap(province => Observable.of(getCitiesByProvince(province)));

    // 区县的选择同时依赖省份和城市，所以需要合并，得到它们合并后的流再去做一个 map 从而得到区县
    // 根据省份和城市的选择得到地区列表
    this.districts$ = Observable
      .combineLatest(province$, city$, (p, c) => ({ province: p, city: c }))
      .mergeMap(a => Observable.of(getAreasByCity(a.province, a.city)));

  }

  ngOnDestroy() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  // 验证表单，验证结果正确返回 null 否则返回一个验证结果对象
  validate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (val.province && val.city && val.district && val.street && val.street.length >= 4) {
      return null;
    }
    return {
      addressNotValid: true
    };
  }

  // 设置初始值
  public writeValue(obj: Address) {
    if (obj) {
      this._address = obj;
      if (this._address.province) {
        this._province.next(this._address.province);
      }
      if (this._address.city) {
        this._city.next(this._address.city);
      }
      if (this._address.district) {
        this._district.next(this._address.district);
      }
      if (this._address.street) {
        this._street.next(this._address.street);
      }
    }
  }

  // 当表单控件值改变时，函数 fn 会被调用
  // 这也是我们把变化 emit 回表单的机制
  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  // 这里没有使用，用于注册 touched 状态
  public registerOnTouched() {
  }

  onProvinceChange() {
    this._province.next(this._address.province);
  }

  onCityChange() {
    this._city.next(this._address.city);
  }

  onDistrictChange() {
    this._district.next(this._address.district);
  }

  onStreetChange() {
    this._street.next(this._address.street);
  }
}
