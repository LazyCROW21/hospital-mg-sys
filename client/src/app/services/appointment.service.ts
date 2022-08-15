import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../common/api-config';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  baseHeader: HttpHeaders;
  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
  getAllAppointments() {
    return this.http.get(baseURL+'/api/appointment', { headers: this.baseHeader });
  }

  getAppointmentById(appointmentId: number) {
    return this.http.get(baseURL+'/api/appointment/'+appointmentId, { headers: this.baseHeader });
  }

  getAppointmentByDoctorId(doctorId: number) {
    return this.http.get(baseURL+'/api/appointment/doctor/'+doctorId, { headers: this.baseHeader });
  }

  getAppointmentByPatientId(patientId: number) {
    return this.http.get(baseURL+'/api/appointment/patient/'+patientId, { headers: this.baseHeader });
  }

  addAppointment(data: any) {
    return this.http.post(baseURL+'/api/appointment', data, { headers: this.baseHeader });
  }
}
