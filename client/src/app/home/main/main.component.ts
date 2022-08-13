import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  hospitalPhotos = [
    { url: '/assets/hospital.jpg', title: 'Hospital', body: 'Worlds best hospital!' },
    { url: '/assets/doctor.png', title: 'Get the best Treatment', body: 'Be assure with the world\'s best doctors & staff.' },
    { url: '/assets/ot.jpg', title: 'World Class Facilities', body: 'We provide our best care to our patients using the most secure and reliable facilities.' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getBackgroundStyle (url: string) {
    return {
      background: `url("${url}")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover'
    }
  }

}
