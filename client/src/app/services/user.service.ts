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
    return this.http.get(environment.apiURL+'/user/new');
  }

  getUserById(id: number) {
    return this.http.get(environment.apiURL+'/user/'+id);
  }

  commitUser(userId: number, status: 'A' | 'R') {
    return this.http.patch(environment.apiURL+'/user/commit/'+userId, { status });
  }

  updateUser(userId: number, data: any) {
    return this.http.patch(environment.apiURL+'/user/'+userId, data);
  }

  getProfile(userId: number) {
    return this.http.get(environment.apiURL+'/user/'+userId+'/img', { responseType: 'arraybuffer' });
  }

  uploadProfile(userId: number, data: any) {
    return this.http.post(environment.apiURL+'/user/'+userId+'/img', data);
  }

  changeUserPWD(userId: number, data: any) {
    return this.http.patch(environment.apiURL+'/user/changePWD/'+userId, data);
  }
  
  deleteUser(userId: number) {
    return this.http.delete(environment.apiURL+'/user/'+userId);
  }
}
