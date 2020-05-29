import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = 'http://localhost:3000/users/';

  constructor(
    private http: HttpClient
  ) { }

  public getUsers() {
    return this.http.post(`${this.API_URL}`, {});
  }
}
