import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }
  
  createAdmin(data: any) {
    return this.http.post(environment.apiURL+'/user', data);
  }

  getAllAdmins() {
    return this.http.get(environment.apiURL+'/admin');
  }

  getAdminById(adminId: number) {
    return this.http.get(environment.apiURL+'/admin/'+adminId);
  }

  removeAdmin(adminId: number) {
    return this.http.delete(environment.apiURL+'/user/'+adminId);
  }
}
