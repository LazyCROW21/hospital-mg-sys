import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
    if(user && role) {
      this.userSubject = new BehaviorSubject<any>(JSON.parse(user));
      this.roleSubject = new BehaviorSubject<any>(JSON.parse(role));
      this.isLoggedIn = new BehaviorSubject<boolean>(true);
    } else {
      this.userSubject = new BehaviorSubject<any>(null);
      this.roleSubject = new BehaviorSubject<any>(null);
      this.isLoggedIn = new BehaviorSubject<boolean>(false);
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
    localStorage.removeItem('TOKEN');
    this.userSubject.next(null);
    this.roleSubject.next(null);
    this.isLoggedIn.next(false);
  }

  createUser(data: any) {
    return this.http.post(environment.apiURL+'/user', data, { headers: this.baseHeader });
  }
}
