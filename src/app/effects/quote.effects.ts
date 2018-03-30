import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { QuoteService } from '../services';
import * as actions from '../actions/quote.action';

@Injectable()
export class QuoteEffects {

  // 首先去监听 actions$ 信号流，捕获到 QUOTE 这个 action，然后调用 service
  // 成功之后继续调用反射一个成功的 action，失败的话就发射一个加载失败的 action
  @Effect()
  quote$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.QUOTE)
    .map(toPayload)
    .switchMap(() => this.quoteService
      .getQuote()
      .map(quote => new actions.QuoteSuccessAction(quote))
      .catch(err => of(new actions.QuoteFailAction(JSON.stringify(err))))
    );

  constructor(private actions$: Actions, private quoteService: QuoteService) { }
}
