import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseHeader: HttpHeaders;
  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
  getAllNewUsers() {
    return this.http.get(environment.apiURL+'/user/new', { headers: this.baseHeader });
  }

  commitUser(userId: number, status: 'A' | 'R') {
    return this.http.patch(environment.apiURL+'/user/'+userId, { status }, { headers: this.baseHeader });
  }
  
  deleteUser(userId: number) {
    return this.http.delete(environment.apiURL+'/user/'+userId, { headers: this.baseHeader });
  }
}
