import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  menuItems: MenuItem[];
  sideMenuItems: MenuItem[];
  showSidebar: boolean = false;

  constructor() {
    this.menuItems = [
      { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: '/dashboard/profile' },
      { label: 'Settings', icon: 'pi pi-fw pi-cog' },
      { label: 'Log out', icon: 'pi pi-fw pi-sign-out' },
    ];
    this.sideMenuItems = [
      { label: 'Dashboard', icon: 'pi pi-fw pi-th-large', routerLink: '/dashboard', command: this.closeSidebar.bind(this) },
      { label: 'Appointment', icon: 'pi pi-fw pi-envelope', routerLink: 'appointment', command: this.closeSidebar.bind(this) },
      { label: 'My Record', icon: 'pi pi-fw pi-briefcase', routerLink: 'myrecord', command: this.closeSidebar.bind(this) },
    ];
  }

  closeSidebar() {
    this.showSidebar = false;
  }

  ngOnInit(): void {
  }

}
