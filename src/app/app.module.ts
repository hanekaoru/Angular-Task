import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// 引入 Core
import { CoreModule } from './core/core.module'
import { MdSidenavModule } from '@angular/material'

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    MdSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
