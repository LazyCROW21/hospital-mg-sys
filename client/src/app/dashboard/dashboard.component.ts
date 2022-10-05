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
  adminSideMenuItems: MenuItem[];
  showSidebar: boolean = false;
  userName = '';

  constructor(public authService: AuthService, private router: Router) {
    this.menuItems = [
      { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: '/dashboard/profile' },
      { label: 'Settings', icon: 'pi pi-fw pi-cog' },
      { label: 'Log out', icon: 'pi pi-fw pi-sign-out', command: this.onLogout.bind(this) },
    ];

    this.sideMenuItems = [
      { label: 'Dashboard', icon: 'pi pi-fw pi-desktop', routerLink: '/dashboard' },
      { label: 'All Departments', icon: 'pi pi-fw pi-th-large', routerLink: '/dashboard/departments' },
      { label: 'All Doctors', icon: 'pi pi-fw pi-prime', routerLink: '/dashboard/doctors' },
      { label: 'Reports', icon: 'pi pi-fw pi-briefcase', routerLink: '/dashboard/reports' },
      { label: 'Appointment', icon: 'pi pi-fw pi-envelope', routerLink: '/dashboard/appointments' }
    ];
    
    this.patientSideMenuItems = [
    ];

    this.doctorSideMenuItems = [
      { label: 'My Department', icon: 'pi pi-fw pi-briefcase', routerLink: ['departments', this.authService.roleSubject.value.departmentId] },
    ];

    this.adminSideMenuItems = [
      { label: 'Admins', icon: 'pi pi-fw pi-user', routerLink: 'admins' },
      { label: 'Users', icon: 'pi pi-fw pi-users', routerLink: 'users' },
    ]
  }

  ngOnInit(): void { }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
