import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { Notice } from '../common/models/notice';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  liveGeneralNotice = new BehaviorSubject<Notice>({
    subject: '', body: '', date: new Date()
  });
  liveDoctorNotice = new BehaviorSubject<Notice>({
    subject: '', body: '', date: new Date()
  });
  liveAdminNotice = new BehaviorSubject<Notice>({
    subject: '', body: '', date: new Date()
  });
  socket: Socket;
  constructor(private http: HttpClient) {
    this.socket = io(environment.wsURL, {
      transports: ['websocket']
    });
    this.socket.on('notice-patient', (data: Notice) => {
      console.log(data);
      this.liveGeneralNotice.next(data);
    });
    this.socket.on('notice-doctor', (data: Notice) => { 
      this.liveDoctorNotice.next(data);
    });
    this.socket.on('notice-admin', (data: Notice) => { 
      this.liveAdminNotice.next(data);
    });
  }
  
  getNotice(nType: 'admin'|'doctor'|'patient') {
    return this.http.get(environment.apiURL+'/notice/'+nType);
  }

  putNotice(nType: 'admin'|'doctor'|'patient', data: any) {
    return this.http.put(environment.apiURL+'/notice/'+nType, data);
  }
}
