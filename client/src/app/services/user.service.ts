import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ICheckLoginRequest, IRegisterRequest, ICatLocRequest } from '../interfaces/user.interface';

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
    private http: HttpClient
  ) {}

  public getUsers() {
    return this.http.post(`${this.API_URL}`, {}, this.httpOptions);
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
}
