import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://294.cyrotech.ch'; // Basis-URL der API
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
  }

  // Login-Funktion
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('https://294.cyrotech.ch/users/login', credentials);
  }

  register(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // KEIN Authorization-Header!
    });

    return this.http.post('https://294.cyrotech.ch/users/register-without-admin', userData, {headers});
  }
  getCurrentUser() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      return this.jwtHelper.decodeToken(token); // Token entschlüsseln
    } catch (error) {
      return null;
    }
  }


}
