import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { MdSidenavModule } from '@angular/material';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    MdSidenavModule,
    AppRoutingModule,
    LoginModule,
    ProjectModule,
    TaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
