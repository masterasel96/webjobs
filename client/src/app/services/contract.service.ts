import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private API_URL = `${environment.api_url}contracts`;
  private httpOptions = {
    headers: (new HttpHeaders())
      .append('Content-Type', 'application/json')
      .append('Authorization', `Basic ${btoa(`${environment.user}:${environment.pass}`)}`)
  };
  constructor(
    private http: HttpClient
  ) { }

  public getContractsByUser(codUser: string) {
    return this.http.post(`${this.API_URL}/getByUser`, {
      codUser
    }, this.httpOptions);
  }

  public createContract(codWorker: string, codContractor: string, msg?: string) {
    return this.http.post(`${this.API_URL}/create`, {
      codContractor,
      codWorker,
      msg
    }, this.httpOptions);
  }
}
