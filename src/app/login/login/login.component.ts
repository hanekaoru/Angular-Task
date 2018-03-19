import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { QuoteService } from '../../services/quote.service';
import { Quote } from '../../domain/quote.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // form 名称可以自行定义
  form: FormGroup;
  quote: Quote = {
    cn: '默认值',
    en: '默认值',
    pic: 'assets/1.jpg'
  }
  constructor(
    private fb: FormBuilder,
    private quoteService$: QuoteService
  ) {
    this.quoteService$.getQuote()
      .subscribe(q => this.quote = q)
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
