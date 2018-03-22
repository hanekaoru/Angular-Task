import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http'
import { Project } from '../domain';
import { Observable } from 'rxjs/Rx'
import { mergeMap } from 'rxjs/operator/mergeMap';

@Injectable()
export class ProjectService {

  private readonly domain = 'projects';
  private headers = new Headers({
    'Content-Type': 'application/json'
  })

  constructor(
    private http: Http,
    @Inject('BASE_CONFIG') private config   
  ) {}

  // 新增列表 POST
  add(project: Project): Observable<Project> {
    project.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .post(uri, JSON.stringify(project), { headers: this.headers })
      .map(res => res.json())
  }

  // 更新列表 patch
  // patch 可以选择一些自己指定更新的条目
  update(project: Project): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    const toUpdate = {
      name: project.name,
      desc: project.desc,
      coverImg: project.coverImg
    }
    return this.http
      .patch(uri, JSON.stringify(toUpdate), { headers: this.headers })
      .map(res => res.json())
  }

  // 删除列表 delete
  del(project: Project): Observable<Project> {
    // 新建的 project 的 taskList 是没有的，为 undefined
    const delTasks$ = Observable.from(project.taskList ? project.taskList : [])
      .mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`))
      // 统计流中的值，最后输出一个值
      .count()
    return delTasks$
      .switchMap(_ => this.http.delete(`${this.config.uri}/${this.domain}/${project.id}`))
      .mapTo(project)
  }

  // 获取列表 get
  get(userId: string): Observable<Project[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get(uri, {params: {'members_like': userId}})
      .map(res => res.json() as Project[])
  }
}