import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  
  baseHeader: HttpHeaders;

  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getAllPatients() {
    return this.http.get(environment.apiURL+'/patient', { headers: this.baseHeader });
  }

  getAllNewPatients() {
    return this.http.get(environment.apiURL+'/patient/new', { headers: this.baseHeader });
  }

  getPatientById(patientId: number) {
    return this.http.get(environment.apiURL+'/patient/'+patientId, { headers: this.baseHeader });
  }
}
