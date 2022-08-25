import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseHeader: HttpHeaders;
  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
  createAdmin(data: any) {
    return this.http.post(environment.apiURL+'/user', data, { headers: this.baseHeader });
  }

  getAllAdmins() {
    return this.http.get(environment.apiURL+'/admin', { headers: this.baseHeader });
  }

  getAdminById(adminId: number) {
    return this.http.get(environment.apiURL+'/admin/'+adminId, { headers: this.baseHeader });
  }

  removeAdmin(adminId: number) {
    return this.http.delete(environment.apiURL+'/admin/'+adminId, { headers: this.baseHeader });
  }
}
