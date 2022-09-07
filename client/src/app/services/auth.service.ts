import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubject = new BehaviorSubject<any>(null);
  roleSubject = new BehaviorSubject<any>(null);
  isLoggedIn = new BehaviorSubject<boolean>(false);
  accessToken = new BehaviorSubject<string>('');
  refreshToken = new BehaviorSubject<string>('');
  userType: 'A' | 'D' | 'P' = 'P';
  baseHeader: HttpHeaders;

  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const user = localStorage.getItem('USER');
    const role = localStorage.getItem('ROLE');
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    const refreshToken = localStorage.getItem('REFRESH_TOKEN');
    try {
      if(user && role && accessToken && refreshToken) {
        this.userSubject.next(JSON.parse(user));
        this.roleSubject.next(JSON.parse(role));
        this.isLoggedIn.next(true);
        this.accessToken.next(accessToken);
        this.refreshToken.next(refreshToken);
        this.userType = this.userSubject.value.role;
      } else {
        this.logout();
      }
    } catch (err) {
      console.log(err);
      this.logout();
    }
  }

  loginUser(data: any) {
    return this.http.post(environment.apiURL+'/auth/login', data, { headers: this.baseHeader });
  }

  setUser(user: any, role: any, isLoggedIn: boolean) {
    this.userSubject.next(user);
    this.roleSubject.next(role);
    this.isLoggedIn.next(isLoggedIn);
    this.userType = this.userSubject.value.role;
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
