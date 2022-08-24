import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  menuItems: MenuItem[];
  sideMenuItems: MenuItem[];
  patientSideMenuItems: MenuItem[];
  doctorSideMenuItems: MenuItem[];
  showSidebar: boolean = false;
  userName = '';

  constructor(public authService: AuthService, private router: Router) {
    this.menuItems = [
      { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: '/dashboard/profile' },
      { label: 'Settings', icon: 'pi pi-fw pi-cog' },
      { label: 'Log out', icon: 'pi pi-fw pi-sign-out', command: this.onLogout.bind(this) },
    ];
    this.sideMenuItems = [
      { label: 'Dashboard', icon: 'pi pi-fw pi-th-large', routerLink: '/dashboard', command: this.closeSidebar.bind(this) },
      { label: 'All Departments', icon: 'pi pi-fw pi-th-large', routerLink: 'departments', command: this.closeSidebar.bind(this) },
      { label: 'Reports', icon: 'pi pi-fw pi-briefcase', routerLink: 'reports', command: this.closeSidebar.bind(this) },
      { label: 'Appointment', icon: 'pi pi-fw pi-envelope', routerLink: 'appointment', command: this.closeSidebar.bind(this) }
    ];
    
    this.patientSideMenuItems = [
    ];

    this.doctorSideMenuItems = [
      { label: 'My Department', icon: 'pi pi-fw pi-briefcase', routerLink: ['departments', '2'], command: this.closeSidebar.bind(this) },
    ]
  }

  closeSidebar() {
    this.showSidebar = false;
  }

  ngOnInit(): void {
    this.userName  = this.authService.userSubject.value.firstName + ' ' + this.authService.userSubject.value.lastName;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
