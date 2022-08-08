import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  menuItems: MenuItem[];


  constructor() {
    this.menuItems = [
      { label: 'Profile', icon: 'pi pi-fw pi-user' },
      { label: 'Settings', icon: 'pi pi-fw pi-cog' },
      { label: 'Log out', icon: 'pi pi-fw pi-sign-out' },
    ];
  }

  ngOnInit(): void {
  }

}
