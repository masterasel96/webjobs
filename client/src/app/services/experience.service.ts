import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private API_URL = `${environment.api_url}profExp`;
  private httpOptions = {
    headers: (new HttpHeaders())
      .append('Content-Type', 'application/json')
      .append('Authorization', `Basic ${btoa(`${environment.user}:${environment.pass}`)}`)
  };
  constructor(
    private http: HttpClient
  ) { }

  public getExperiences(codUser: string) {
    return this.http.post(`${this.API_URL}`, { codUser }, this.httpOptions);
  }
}
