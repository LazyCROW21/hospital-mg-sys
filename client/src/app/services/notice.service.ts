import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  socket: Socket;
  constructor(private http: HttpClient) {
    this.socket = io(environment.wsURL, {
      transports: ['websocket']
    });
    this.socket.on('notice', (data: any) => { console.log(data); });
  }
  
  getNotice(nType: 'admin'|'doctor'|'patient') {
    return this.http.get(environment.apiURL+'/notice/'+nType);
  }

  putNotice(nType: 'admin'|'doctor'|'patient', data: any) {
    return this.http.put(environment.apiURL+'/notice/'+nType, data);
  }
}
