import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private http: HttpClient) { }
  
  getAllAppointments() {
    return this.http.get(environment.apiURL+'/appointment');
  }

  getAllNextAppointments() {
    return this.http.get(environment.apiURL+'/appointment/next');
  }

  getAppointmentById(appointmentId: number) {
    return this.http.get(environment.apiURL+'/appointment/'+appointmentId);
  }

  getAppointmentByDoctorId(doctorId: number) {
    return this.http.get(environment.apiURL+'/appointment/doctor/'+doctorId);
  }

  getNextAppointmentsByDoctorId(doctorId: number) {
    return this.http.get(environment.apiURL+'/appointment/doctor/next/'+doctorId);
  }

  getAppointmentByPatientId(patientId: number) {
    return this.http.get(environment.apiURL+'/appointment/patient/'+patientId);
  }

  getNextAppointmentsByPatientId(patientId: number) {
    return this.http.get(environment.apiURL+'/appointment/patient/next/'+patientId);
  }

  addAppointment(data: any) {
    return this.http.post(environment.apiURL+'/appointment', data);
  }

  changeAppointmentStatus(id: number, data: any) {
    return this.http.patch(environment.apiURL+'/appointment/status/'+id, data);
  }

  concludeAppointment(role: 'doctor'|'patient', appointmentId: number, data: any) {
    return this.http.patch(environment.apiURL+`/appointment/conclude/${role}/${appointmentId}`, data);
  }

  editAppointment(id: number, data: any) {
    return this.http.patch(environment.apiURL+'/appointment/'+id, data);
  }
}
