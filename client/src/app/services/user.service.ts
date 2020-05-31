import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = `${environment.api_url}users/`;
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
}
