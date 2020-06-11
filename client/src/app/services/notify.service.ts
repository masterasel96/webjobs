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
}
