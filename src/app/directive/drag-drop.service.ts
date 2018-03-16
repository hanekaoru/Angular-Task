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

  // 使用 BehaviorSubject，因为其总是可以记住上一次的值
  private _dragData = new BehaviorSubject<DragData>(null);

  setDragData(data: DragData) {
    this._dragData.next(data);
  }

  getDragData(): Observable<DragData> {
    return this._dragData.asObservable();
  }

  clearDragData() {
    this._dragData.next(null);
  }

}
