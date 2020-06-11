import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  private API_URL = `${environment.api_url}notifications`;
  private httpOptions = {
    headers: (new HttpHeaders())
      .append('Content-Type', 'application/json')
      .append('Authorization', `Basic ${btoa(`${environment.user}:${environment.pass}`)}`)
  };
  constructor(
    private http: HttpClient
  ) { }

  public getNotifys(codUser: string) {
    return this.http.post(`${this.API_URL}`, { codUser }, this.httpOptions);
  }

  public seeNotify(codNotification: string) {
    return this.http.post(`${this.API_URL}/see`, { codNotification }, this.httpOptions);
  }

  public setNotify(data: {
    codUser: string,
    codIndirectUser: string,
    message: string
  }) {
    return this.http.post(`${this.API_URL}/create`, data, this.httpOptions);
  }

  public checkForNotifys(codUser: string) {
    return this.http.post(`${this.API_URL}/checkNew`, { codUser }, this.httpOptions);
  }
}
