import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Iinventory } from '../../../interfaces/domain/iInventory';
import { Product } from './../../../models/domain/product';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  coreURL;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {
    this.coreURL = environment.coreURL;
  }


  getAll(): Observable<object> {
    return this.httpClient.get(this.coreURL + 'api/inventory/GetAll');
  }

  getById(id: number): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/inventory/GetById?Id=${id}`);
  }

  getItems(input: string): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/inventory/GetItems?input=${input}`);
  }

  getInventoryDetails(inventoryId: number): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/inventory/GetInventoryDetails?inventoryId=${inventoryId}`);
  }


  closedInventory(id: number): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/inventory/ClosedInventory?id=${id}`);
  }

  generateInventoryExcel(id: number): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/inventory/GenerateInventoryExcel?Id=${id}`);
  }

  saveItem(request: Product) {
    let data = JSON.stringify(request);
    return this.httpClient.post(`${this.coreURL}api/inventory/SaveItem`, data, { headers: this.headers });
  }

  create(request: Iinventory) {
    let data = JSON.stringify(request);
    return this.httpClient.post(`${this.coreURL}api/inventory/Create`, data, { headers: this.headers });
  }

  update(request: Iinventory) {
    let data = JSON.stringify(request);
    return this.httpClient.put(`${this.coreURL}api/inventory/Update`, data, { headers: this.headers });
  }

  delete(id: number): Observable<object> {
    return this.httpClient.delete(this.coreURL + `api/inventory/Delete?id=${id}`);
  }

  deleteInventoryDetail(id: number): Observable<object> {
    return this.httpClient.delete(this.coreURL + `api/inventory/DeleteInventoryDetail?id=${id}`);
  }

  
}
