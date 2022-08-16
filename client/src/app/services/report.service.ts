import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../common/api-config';

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
    return this.http.get(baseURL+'/api/report', { headers: this.baseHeader });
  }

  getReportById(reportId: number) {
    return this.http.get(baseURL+'/api/report/'+reportId, { headers: this.baseHeader });
  }

  getReportsByDoctorId(doctorId: number) {
    return this.http.get(baseURL+'/api/report/doctor/'+doctorId, { headers: this.baseHeader });
  }

  getReportsByPatientId(patientId: number) {
    return this.http.get(baseURL+'/api/report/patient/'+patientId, { headers: this.baseHeader });
  }

  addReport(data: any) {
    return this.http.post(baseURL+'/api/report', data, { headers: this.baseHeader });
  }
}
