import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  
  constructor(private http: HttpClient) { }

  getAllPatients() {
    return this.http.get(environment.apiURL+'/patient');
  }

  getAllNewPatients() {
    return this.http.get(environment.apiURL+'/patient/new');
  }

  getPatientById(patientId: number) {
    return this.http.get(environment.apiURL+'/patient/'+patientId);
  }
}
