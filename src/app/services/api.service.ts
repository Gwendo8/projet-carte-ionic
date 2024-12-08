import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/data`);
  }
  getListData(): Observable<any>{
    return this.http.get(`${this.baseUrl}/form-data`);
  }
  addCard(card: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/add-data`, card);
  }
}
