import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor(private http: HttpClient) { }
  
  getAllDoctors() {
    return this.http.get(environment.apiURL+'/doctor');
  }

  getAllNewDoctors() {
    return this.http.get(environment.apiURL+'/doctor/new');
  }

  getDoctorById(doctorId: number) {
    return this.http.get(environment.apiURL+'/doctor/'+doctorId);
  }

  getDoctorByUserId(doctorId: number) {
    return this.http.get(environment.apiURL+'/doctor/user/'+doctorId);
  }

  getDoctorByDepartmentId(departmentId: number) {
    return this.http.get(environment.apiURL+'/doctor/department/'+departmentId);
  }

  updateDoctorById(doctorId: number, data: any) {
    return this.http.patch(environment.apiURL+`/doctor/user/${doctorId}`, data);
  }

  moveDoctorByUserId(doctorId: number, data: any) {
    return this.http.patch(environment.apiURL+`/doctor/user/${doctorId}/move/`, data);
  }
}
