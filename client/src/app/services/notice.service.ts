import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  constructor(private http: HttpClient) { }
  
  getNotice(nType: 'admin'|'doctor'|'patient') {
    return this.http.get(environment.apiURL+'/notice/'+nType);
  }

  putNotice(nType: 'admin'|'doctor'|'patient', data: any) {
    return this.http.put(environment.apiURL+'/notice/'+nType, data);
  }
}
