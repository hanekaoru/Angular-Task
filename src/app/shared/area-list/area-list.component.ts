import { Component, Input, forwardRef, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { 
  ControlValueAccessor, 
  NG_VALUE_ACCESSOR, 
  NG_VALIDATORS, 
  FormControl, 
  FormBuilder, 
  FormGroup 
} from '@angular/forms';
import { Address } from '../../domain';
import { Subject, Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx'
import { getProvinces, getCitiesByProvince, getAreaByCity } from '../../utils/area.util';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef( () => AreaListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef( () => AreaListComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  _address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  }
  // 在数据变化的时候，以 Subject 的形式发送数据
  _province = new Subject();
  _city = new Subject();
  _district = new Subject();
  _street = new Subject();
  
  // 三个选择框的填充内容
  provinces$: Observable<string[]>;
  cities$: Observable<string[]>;
  districts$: Observable<string[]>;

  sub: Subscription;
  public propagateChange = (_: any) => {}
  constructor() { }

  // 由于地址是由下面四个部分构成，如果四个流当中有任何一个流发生了变化，就会产生一个新的地址
  // 所以从行为上来说非常类似 combineLatest，
  ngOnInit() {
    const province$ = this._province.asObservable().startWith('')
    const city$ = this._city.asObservable().startWith('')
    const district$ = this._district.asObservable().startWith('')
    const street$ = this._street.asObservable().startWith('')

    // 合并多个流，超过两个流以上的话可以使用数组
    const val$ = Observable.combineLatest([province$, city$, district$, street$], (_p, _c, _d, _s) => {
      return {
        province: _p,
        city: _c,
        district: _d,
        street: _s
      }
    })
    
    // 进行订阅后，将它的值发送出去，让外部知道其变化
    this.sub = val$.subscribe(v => {
      this.propagateChange(v);
    })

    // 省份的流，是利用 getProvinces() 方法得到了一个数组，然后利用 of 方法将其转换为流
    this.provinces$ = Observable.of(getProvinces())

    // 关于城市的流，是选择完省份之后，依据选择的省份去对应数据当中去把这个省份对应的城市取回
    // 即 province$，在它改变的时候，可以得到改变的省，利用该省来去得到对应的城市列表
    this.cities$ = province$.map((p: string) => getCitiesByProvince(p))

    // 区县的选择同时依赖省份和城市，所以需要合并，得到它们合并后的流再去做一个 map 从而得到区县
    this.districts$ = Observable.combineLatest(province$, city$, (p: string, c: string) => getAreaByCity(p, c))

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  writeValue(obj: Address): void {
    if (obj) {
      this._address = obj;
      // 将变化发射出去
      if (this._address.province) {
        this._province.next(this._address.province)
      }

      if (this._address.city) {
        this._city.next(this._address.city)
      }

      if (this._address.district) {
        this._district.next(this._address.district)
      }

      if (this._address.street) {
        this._street.next(this._address.street)
      }
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  validate(c: FormControl): {[key: string]: any} {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (val.province && val.city && val.district && val.street) {
      return null;
    }
    return {
      addressInvalid: true
    }
  }

  onProvinceChange() {
    this._province.next(this._address.province)
  }

  onCityChange() {
    this._city.next(this._address.city)
  }

  onDistrictChange() {
    this._district.next(this._address.district)
  }

  onStreetChange() {
    this._street.next(this._address.street)
  }

}