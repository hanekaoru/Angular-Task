import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http'
import { Project, User } from '../domain';
import { Observable } from 'rxjs/Rx'
import { mergeMap } from 'rxjs/operator/mergeMap';
import { Auth } from '../domain/auth.model';

@Injectable()
export class AuthService {

  private readonly domain = 'users';
  private headers = new Headers({
    'Content-Type': 'application/json'
  })
  
  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9' + '.eyJmcm9tX3VzZXIiOiJCIiwidGFyZ2V0X3VzZXIiOiJBIn0' + '.rSWamyAYwuHCo7IFAgd1oRpSP7nzL7BF5t7ItqpKViM';

  constructor(
    private http: Http,
    @Inject('BASE_CONFIG') private config   
  ) {}

  // 注册
  register(user: User): Observable<Auth> {
    user.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get(uri, {params: {'email': user.email}})
      .switchMap(res => {
        // 查询后返回的一个结果集
        if (res.json().lenght > 0) {
          throw 'user existed'
        }
        return this.http
          .post(uri, JSON.stringify(user), { headers: this.headers })
          // 返回的其实是 user
          .map(r => ({
            token: this.token,
            user: r.json()
          }))
      })
  }

  // 登录
  login(username: string, password: string): Observable<Auth> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get(uri, {params: {'email': username, 'password': password}})
      .map(res => {
        if (res.json().length === 0) {
          throw 'username or password not match'
        }
        return {
          token: this.token,
          user: res.json()[0]
        }
      })
  }
}