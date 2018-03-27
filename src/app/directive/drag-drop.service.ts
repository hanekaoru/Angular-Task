import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// tag 唯一标识，标识拖拽元素
// data 拖拽传递的数据
export interface DragData {
  tag: string;
  data: any;
}

@Injectable()
export class DragDropService {

  // 使用 BehaviorSubject，因为其总是可以记住上一次的一个最新值
  private _dragData = new BehaviorSubject<DragData>(null);

  // 在开始拖拽的时候，把流中新增一个 data 元素，把这个最新值 next 出去
  setDragData(data: DragData) {
    this._dragData.next(data);
  }

  // 当放到否个区域的时候，可以得到这个 Observable，所以取值的时候就会取到最新的 data
  // 尽管在拖拽的过程中值已经发射完了，但是依然可以得到上一次发射之后最新的一个值
  getDragData(): Observable<DragData> {
    return this._dragData.asObservable();
  }

  // 清空的时候将一个 null 放到这个流中
  // 可以保证在其他误接收的地方会发现这是一个 null，即没有这个值
  clearDragData() {
    this._dragData.next(null);
  }

}
