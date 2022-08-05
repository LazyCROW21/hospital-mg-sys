import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showMenu: boolean = true;

  constructor() { }

  ngOnInit(): void {
    if(window.innerWidth >= 768) {
      this.showMenu = true;
    } else {
      this.showMenu = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // console.log(event);
    if(window.innerWidth >= 768) {
      this.showMenu = true;
    } else {
      this.showMenu = false;
    }
  }

}
