import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../common/api-config';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  baseHeader: HttpHeaders;
  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
  getAllRecords() {
    return this.http.get(baseURL+'/api/record', { headers: this.baseHeader });
  }

  getRecordById(recordId: number) {
    return this.http.get(baseURL+'/api/record/'+recordId, { headers: this.baseHeader });
  }

  getRecordsByDoctorId(doctorId: number) {
    return this.http.get(baseURL+'/api/record/doctor/'+doctorId, { headers: this.baseHeader });
  }

  getRecordsByPatientId(patientId: number) {
    return this.http.get(baseURL+'/api/record/patient/'+patientId, { headers: this.baseHeader });
  }

  addRecord(data: any) {
    return this.http.post(baseURL+'/api/record', data, { headers: this.baseHeader });
  }
}
