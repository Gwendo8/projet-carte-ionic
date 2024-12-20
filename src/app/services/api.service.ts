import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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
    return this.http.post(`${this.baseUrl}/add-card`, card);
  }
  getCardById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/data/${id}`);
  }
  updateCard(id: number, data: FormData) {
    return this.http.put(`${this.baseUrl}/update-card/${id}`, data);
  }
  deleteCard(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.baseUrl}/login`, body);
  }
  getCategories(): Observable<any[]> {
    return this.http.get<{ categories: any[] }>(`${this.baseUrl}/form-data`).pipe(
      map((response) => response.categories)
    );
  }
  updateProfileImage(formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/profile-image`, formData);
  }
  getProfileImage(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}/profile-image`);
  }
}