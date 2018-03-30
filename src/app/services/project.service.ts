import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { Project, User } from '../domain';

@Injectable()
export class ProjectService {
  private readonly domain = 'projects';
  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(@Inject('BASE_CONFIG') private config,
    private http: Http) {
    // this.headers.append('X-LC-Id', config.LCId);
    // this.headers.append('X-LC-Key', config.LCKey);
  }

  // 新增列表 POST /projects
  add(project: Project): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .post(uri, JSON.stringify(project), { headers: this.headers })
      .map(res => res.json());
  }

  // 更新列表 patch
  // patch 可以选择一些自己指定更新的条目
  update(project: Project): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    const toUpdate = {
      name: project.name,
      coverImg: project.coverImg,
      desc: project.desc
    };
    return this.http
      .patch(uri, JSON.stringify(toUpdate), { headers: this.headers })
      .map(res => res.json());
  }

  // 删除列表 delete /projects
  del(project: Project): Observable<Project> {
    const deltask$ = Observable.from(project.taskLists ? project.taskLists : [])
      .mergeMap(listId => this.http
        .delete(`${this.config.uri}/taskLists/${listId}`))
      .count();
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    return deltask$.switchMap(p => this.http
      .delete(uri)
      .map(_ => project));
  }

  // 获取列表 get /projects
  get(userId: string): Observable<Project[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get(uri, { params: { 'members_like': userId }, headers: this.headers })
      .map(res => res.json());
  }

  updateTaskLists(project: Project): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    const toUpdate = {
      taskLists: project.taskLists
    };
    return this.http
      .patch(uri, JSON.stringify(toUpdate), { headers: this.headers })
      .map(res => res.json());
  }

  inviteMembers(projectId: string, users: User[]) {
    const uri = `${this.config.uri}/${this.domain}/${projectId}`;

    return this.http
      .get(uri)
      .map(res => res.json() as Project)
      .switchMap((project: Project) => {
        // 根据 url 取得这个 project，可以得到 members 数组
        const existingMemberIds = project.members;
        // 得到传递进来的 users 数组当中的 id
        const invitedIds = users.map(user => user.id);
        // 取两者的并集
        const newIds = _.union(existingMemberIds, invitedIds);
        return this.http.patch(uri, JSON.stringify({ members: newIds }), { headers: this.headers });
      })
      .map(res => res.json());
  }
}
