import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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
    return this.http.get(environment.apiURL+'/doctor', { headers: this.baseHeader });
  }

  getAllNewDoctors() {
    return this.http.get(environment.apiURL+'/doctor/new', { headers: this.baseHeader });
  }

  getDoctorById(doctorId: number) {
    return this.http.get(environment.apiURL+'/doctor/'+doctorId, { headers: this.baseHeader });
  }

  getDoctorByUserId(doctorId: number) {
    return this.http.get(environment.apiURL+'/doctor/user/'+doctorId, { headers: this.baseHeader });
  }

  getDoctorByDepartmentId(departmentId: number) {
    return this.http.get(environment.apiURL+'/doctor/department/'+departmentId, { headers: this.baseHeader });
  }

  moveDoctorByUserId(doctorId: number, data: any) {
    return this.http.patch(environment.apiURL+`/doctor/user/${doctorId}/move/`, data, { headers: this.baseHeader });
  }
}
