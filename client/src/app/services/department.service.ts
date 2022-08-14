import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../common/api-config';

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

  getAllDepartments() {
    return this.http.get(baseURL+'/api/department', { headers: this.baseHeader });
  }

  addDepartment(data: any) {
    return this.http.post(baseURL+'/api/department', data, { headers: this.baseHeader });
  }
}
