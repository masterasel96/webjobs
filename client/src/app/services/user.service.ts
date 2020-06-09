import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ICheckLoginRequest, IRegisterRequest, ICatLocRequest } from '../interfaces/user.interface';
import { CookieService } from 'ngx-cookie-service';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = `${environment.api_url}users`;
  private httpOptions = {
    headers: (new HttpHeaders())
      .append('Content-Type', 'application/json')
      .append('Authorization', `Basic ${btoa(`${environment.user}:${environment.pass}`)}`)
  };

  constructor(
    private http: HttpClient,
    private cookies: CookieService
  ) {}

  public getUsers() {
    return this.http.post(`${this.API_URL}`, {}, this.httpOptions);
  }

  public getUser(codUser: string) {
    return this.http.post(`${this.API_URL}`, { codUser }, this.httpOptions);
  }

  public checkLogin(data: ICheckLoginRequest) {
    return this.http.post(`${this.API_URL}/login`, data, this.httpOptions);
  }

  public register(data: IRegisterRequest ) {
    return this.http.post(`${this.API_URL}/create`, data, this.httpOptions);
  }

  public getUsersByCatLoc(data: ICatLocRequest) {
    return this.http.post(`${this.API_URL}/byCatLoc`, data, this.httpOptions);
  }

  public setToken(codUser: string, name: string, lastName: string) {
    const md5 = new Md5();
    const token = md5.appendStr(`${name}:::${lastName}:::${(new Date()).toString()}`).end().toString();
    this.cookies.set('token', token);
    this.cookies.set('codUser', codUser);
    return this.http.put(`${this.API_URL}/update`, {
      codUser,
      newValues: {
        token
      }
    }, this.httpOptions);
  }

  public getToken(): string {
    return this.cookies.get('token');
  }

  public getCodUser(): string {
    return this.cookies.get('codUser');
  }

  public deleteToken(): void {
    this.cookies.delete('token');
    this.cookies.delete('codUser');
  }

  public checkUserSession() {
    return this.http.post(`${this.API_URL}/checkLogin`, {
      token: this.getToken()
    }, this.httpOptions);

  }
}
