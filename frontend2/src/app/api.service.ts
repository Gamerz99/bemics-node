import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  login(data) {
    return this.http.post<any>(this.url + '/users/login', data);
  }

  register(data) {
    return this.http.post<any>(this.url + '/users', data);
  }

  verify(data) {
    return this.http.post<any>(this.url + '/users/verify', data);
  }


  gettoken() {
    return localStorage.getItem('token');
  }

  loggedin() {
    return !!localStorage.getItem('token');
  }

  logout() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('session_data');
    }
  }
}
