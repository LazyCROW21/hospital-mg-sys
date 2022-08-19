import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  baseHeader: HttpHeaders;
  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getDepartment(departmentId: number) {
    return this.http.get(environment.apiURL+'/department/'+departmentId, { headers: this.baseHeader });
  }

  getAllDepartments() {
    return this.http.get(environment.apiURL+'/department', { headers: this.baseHeader });
  }

  getSubDepartments(departmentId: number) {
    return this.http.get(environment.apiURL+'/department/sub-departments/'+departmentId, { headers: this.baseHeader });
  }

  addDepartment(data: any) {
    return this.http.post(environment.apiURL+'/department', data, { headers: this.baseHeader });
  }

  deleteDepartment(departmentId: number) {
    return this.http.delete(environment.apiURL+'/department/'+departmentId, { headers: this.baseHeader });
  }
}
