import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseHeader: HttpHeaders;
  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
  getAllReports() {
    return this.http.get(environment.apiURL+'/report', { headers: this.baseHeader });
  }

  getReportById(reportId: number) {
    return this.http.get(environment.apiURL+'/report/'+reportId, { headers: this.baseHeader });
  }

  getReportsByDoctorId(doctorId: number) {
    return this.http.get(environment.apiURL+'/report/doctor/'+doctorId, { headers: this.baseHeader });
  }

  getReportsByPatientId(patientId: number) {
    return this.http.get(environment.apiURL+'/report/patient/'+patientId, { headers: this.baseHeader });
  }

  addReport(data: any) {
    return this.http.post(environment.apiURL+'/report', data, { headers: this.baseHeader });
  }
}
