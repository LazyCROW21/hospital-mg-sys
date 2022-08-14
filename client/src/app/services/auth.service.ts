import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../common/api-config';
import { createUser } from '../common/types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseHeader: HttpHeaders;
  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  createUser(data: createUser) {
    return this.http.post(baseURL, data, { headers: this.baseHeader });
  }
}
