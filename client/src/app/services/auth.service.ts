import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from '../interceptor/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  accessToken: BehaviorSubject<string>;
  refreshToken: BehaviorSubject<string>;
  userSubject: BehaviorSubject<any>;
  roleSubject: BehaviorSubject<any>;
  isLoggedIn: BehaviorSubject<boolean>;

  baseHeader: HttpHeaders;
  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const user = localStorage.getItem('USER');
    const role = localStorage.getItem('ROLE');
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    const refreshToken = localStorage.getItem('REFRESH_TOKEN');
    if(user && role && accessToken && refreshToken) {
      this.userSubject = new BehaviorSubject<any>(JSON.parse(user));
      this.roleSubject = new BehaviorSubject<any>(JSON.parse(role));
      this.isLoggedIn = new BehaviorSubject<boolean>(true);
      this.accessToken = new BehaviorSubject<string>(accessToken);
      this.refreshToken = new BehaviorSubject<string>(refreshToken);
    } else {
      this.userSubject = new BehaviorSubject<any>(null);
      this.roleSubject = new BehaviorSubject<any>(null);
      this.isLoggedIn = new BehaviorSubject<boolean>(false);
      this.accessToken = new BehaviorSubject<string>('');
      this.refreshToken = new BehaviorSubject<string>('');

      localStorage.removeItem('USER');
      localStorage.removeItem('ROLE');
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('REFRESH_TOKEN');
    }
  }

  loginUser(data: any) {
    return this.http.post(environment.apiURL+'/auth/login', data, { headers: this.baseHeader });
  }

  setUser(user: any, role: any, isLoggedIn: boolean) {
    this.userSubject.next(user);
    this.roleSubject.next(role);
    this.isLoggedIn.next(isLoggedIn);
  }

  logout() {
    localStorage.removeItem('USER');
    localStorage.removeItem('ROLE');
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('REFRESH_TOKEN');
    this.userSubject.next(null);
    this.roleSubject.next(null);
    this.isLoggedIn.next(false);
  }

  createUser(data: any) {
    return this.http.post(environment.apiURL+'/user', data, { headers: this.baseHeader });
  }
}
