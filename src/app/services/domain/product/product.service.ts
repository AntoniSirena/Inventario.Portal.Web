import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Iproduct } from '../../../interfaces/domain/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  coreURL;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {
    this.coreURL = environment.coreURL;
  }

  getAll(): Observable<object> {
    return this.httpClient.get(this.coreURL + 'api/product/GetAll');
  }

  getById(id: number): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/product/GetById?Id=${id}`);
  }
  
  create(request: Iproduct) {
    let data = JSON.stringify(request);
    return this.httpClient.post(`${this.coreURL}api/product/create`, data, { headers: this.headers });
  }

  update(request: Iproduct) {
    let data = JSON.stringify(request);
    return this.httpClient.put(`${this.coreURL}api/product/update`, data, { headers: this.headers });
  }

  delete(id: number): Observable<object> {
    return this.httpClient.delete(this.coreURL + `api/product/delete?id=${id}`);
  }
  
}
