import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http'
import { TaskList, Task } from '../domain';
import { Observable } from 'rxjs/Rx'
import { mergeMap } from 'rxjs/operator/mergeMap';
import { mapTo } from 'rxjs/operators';

@Injectable()
export class TaskListService {

  private readonly domain = 'taskLists';
  private headers = new Headers({
    'Content-Type': 'application/json'
  })

  constructor(
    private http: Http,
    @Inject('BASE_CONFIG') private config   
  ) {}

  add(taskList: TaskList): Observable<TaskList> {
    taskList.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .post(uri, JSON.stringify(taskList), { headers: this.headers })
      .map(res => res.json())
  }

  update(taskList: TaskList): Observable<TaskList> {
    const uri = `${this.config.uri}/${this.domain}/${taskList.id}`;
    const toUpdate = {
      name: taskList.name
    }
    return this.http
      .patch(uri, JSON.stringify(toUpdate), { headers: this.headers })
      .map(res => res.json())
  }

  del(taskList: TaskList): Observable<TaskList> {
    const uri = `${this.config.uri}/taskLists/${taskList.id }`
    return this.http.delete(uri)
      .mapTo(taskList)
  }

  get(projectId: string): Observable<TaskList[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get(uri, {params: {'projectId': projectId}})
      .map(res => res.json() as TaskList[])
  }

  // 交换列表
  swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {

    // 获取拖拽与目标的 uri
    const dragUri = `${this.config.uri}/${this.domain}/${src.id}`
    const dropUri = `${this.config.uri}/${this.domain}/${target.id}`

    const drag$ = this.http
      .patch(dragUri, JSON.stringify({order: target.order}), { headers: this.headers})
      .map(res => res.json())
    const drop$ = this.http
      .patch(dropUri, JSON.stringify({order: src.order}), { headers: this.headers})
      .map(res => res.json())

    return Observable
      .concat(drag$, drop$)
      .reduce((arrs, list) => [...arrs, list], [])
  }
}