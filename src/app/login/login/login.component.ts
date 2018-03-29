import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { QuoteService } from '../../services/quote.service';
import { Quote } from '../../domain/quote.model';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store'
import * as fromRoot from '../../reducers'
import * as actions from '../../actions/quote.action'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // form 名称可以自行定义
  form: FormGroup;
  quote$;

  // 把 store 注入进来
  constructor(
    private fb: FormBuilder,
    private quoteService$: QuoteService,
    private store$: Store<fromRoot.State>
  ) {
    // store 可以去发射信号，也可以去取得最新的状态
    this.quote$ = this.store$.select(fromRoot.getQuote)

    this.quoteService$.getQuote()
      .subscribe(q => {
        this.store$.dispatch(new actions.LoadSuccessAction(q))
      })
  }

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
