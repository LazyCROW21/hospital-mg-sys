import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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
    return this.http.get(environment.apiURL+'/appointment', { headers: this.baseHeader });
  }

  getAllNextAppointments() {
    return this.http.get(environment.apiURL+'/appointment/next', { headers: this.baseHeader });
  }

  getAppointmentById(appointmentId: number) {
    return this.http.get(environment.apiURL+'/appointment/'+appointmentId, { headers: this.baseHeader });
  }

  getAppointmentByDoctorId(doctorId: number) {
    return this.http.get(environment.apiURL+'/appointment/doctor/'+doctorId, { headers: this.baseHeader });
  }

  getNextAppointmentsByDoctorId(doctorId: number) {
    return this.http.get(environment.apiURL+'/appointment/doctor/next/'+doctorId, { headers: this.baseHeader });
  }

  getAppointmentByPatientId(patientId: number) {
    return this.http.get(environment.apiURL+'/appointment/patient/'+patientId, { headers: this.baseHeader });
  }

  getNextAppointmentsByPatientId(patientId: number) {
    return this.http.get(environment.apiURL+'/appointment/patient/next/'+patientId, { headers: this.baseHeader });
  }

  addAppointment(data: any) {
    return this.http.post(environment.apiURL+'/appointment', data, { headers: this.baseHeader });
  }

  changeAppointmentStatus(id: number, data: any) {
    return this.http.patch(environment.apiURL+'/appointment/'+id, data, { headers: this.baseHeader });
  }
}
