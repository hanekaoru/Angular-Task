## Angular Task

`Angular 4.x` 搭建的一个企业级协作平台

跟着学习一些 `Angular` 高阶知识，记录一些相关笔记

笔记以及开发过程中遇到的相关问题汇总见：[Angular-Task](https://github.com/hanekaoru/WebLearningNotes/tree/master/angular#angular-task)

----

## Use

```
$ yarn install
```

然后开启 `mock` 服务

```
$ json-server ./mock/data.json --watch
```

运行

```
$ ng serve --open
```

如果安装完成后运行报 `materials` 相关错误，则可以尝试手动进行安装 `materials`，指定版本为 `@2.0.0-beta.8`

```
$ npm/yarn install --save @angular/material@2.0.0-beta.7
```

----

## 技术栈

* 基于 `@ngrx/store` 和 `@ngrx/effects` 管理状态以及状态产生的影响

* 使用 `rxjs` 实现响应式编程

* 使用 `json-server` 生成原型 `REST API`

* 使用 `@angular/material` 为界面组件库以及实现界面主题

* 使用 `@angular/animations` 完成动画

* 使用 `karma` 进行单元测试：组件、服务、`effects` 和 `reducer` 等

