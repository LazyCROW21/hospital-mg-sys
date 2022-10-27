import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { NoticeService } from './services/notice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  
  constructor(private primengConfig: PrimeNGConfig, private noticeService: NoticeService) {
    noticeService.doDummyTask();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
