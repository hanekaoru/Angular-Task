import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http'
import { Project, User } from '../domain';
import { Observable } from 'rxjs/Rx'
import { mergeMap } from 'rxjs/operator/mergeMap';

@Injectable()
export class UserService {

  private readonly domain = 'users';
  private headers = new Headers({
    'Content-Type': 'application/json'
  })

  constructor(
    private http: Http,
    @Inject('BASE_CONFIG') private config   
  ) {}

  // 添加成员时候的提示
  serachUsers(filter: string): Observable<User[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get(uri, {params: {'email_like': filter}})
      .map(res => res.json() as User[])
  }

  // 获取项目当中的所有的用户
  getUsersByProject(projectId: string): Observable<User[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get(uri, {params: {'projectId': projectId}})
      .map(res => res.json() as User[])
  }

  addProjectRef(user: User, projectId: string): Observable<User> {
    const uri = `${this.config.uri}/${this.domain}/${user.id}`;
    const projectIds = user.projectIds ? user.projectIds : [];
    if (projectIds.indexOf(projectId)) {
      return Observable.of(user);
    }
    return this.http
      .patch(uri, JSON.stringify({
        projectIds: [...projectIds, projectId]
      }), { headers: this.headers })
      .map(res => res.json() as User);
  }

  removeProjectRef(user: User, projectId: string): Observable<User> {
    const uri = `${this.config.uri}/${this.domain}/${user.id}`;
    const projectIds = user.projectIds ? user.projectIds : [];
    const index = projectIds.indexOf(projectId);
    // 如果不存在，直接返回
    if (index === -1) {
      return Observable.of(user);
    }
    const toUpdate = [...projectIds.slice(0, index), ...projectIds.slice(index + 1)]
    return this.http
      .patch(uri, JSON.stringify({
        projectIds: [...projectIds, toUpdate]
      }), { headers: this.headers })
      .map(res => res.json() as User);
  }

  // 批量操作
  batchUodateProjectRef(project: Project): Observable<User[]> {
    const projectId = project.id;
    const memberIds = project.members ? project.members : []
    return Observable.from(memberIds)
      .switchMap(id => {
        const uri = `${this.config.uri}/${this.domain}/${id}`
        return this.http.get(uri).map(res => res.json() as User)
      })
      .filter(user => user.projectIds.indexOf(projectId) === -1)
      .switchMap(u => this.addProjectRef(u, projectId))
      .reduce((arr, curr) => [...arr, curr], [])
  }

}