/**
 * 共享模块
 * 导入需要的东西，然后在导出出去，作用有两点
 * 一个是有的模块需要 CommonModule 只需要加载本模块即可，不需要再去加载 CommonModule 模块
 * 另一个就是有些共享的组件
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule
  ],
  declarations: []
})

export class SharedModule { }
