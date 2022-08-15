import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../common/api-config';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  baseHeader: HttpHeaders;
  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  
  getAllDoctors() {
    return this.http.get(baseURL+'/api/doctor', { headers: this.baseHeader });
  }

  getDoctorById(doctorId: number) {
    return this.http.get(baseURL+'/api/doctor/'+doctorId, { headers: this.baseHeader });
  }

  getDoctorByDepartmentId(departmentId: number) {
    return this.http.get(baseURL+'/api/doctor/department/'+departmentId, { headers: this.baseHeader });
  }
}
