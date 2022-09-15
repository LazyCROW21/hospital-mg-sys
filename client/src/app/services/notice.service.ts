import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  baseHeader: HttpHeaders;
  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
  getNotice(nType: 'admin'|'doctor'|'patient') {
    return this.http.get(environment.apiURL+'/notice/'+nType, { headers: this.baseHeader });
  }

  putNotice(nType: 'admin'|'doctor'|'patient', data: any) {
    return this.http.put(environment.apiURL+'/notice/'+nType, data, { headers: this.baseHeader });
  }
}
