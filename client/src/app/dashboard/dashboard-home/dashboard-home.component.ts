import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  loadingIcon: string = '';
  role: 'A' | 'D' | 'P';
  user: any;

  // accept, reject, cancel btn icons
  updateButtonIcons = {
    'rejected': 'pi pi-ban',
    'fixed': 'pi pi-check',
    'cancelled': 'pi pi-ban'
  };

  constructor(
    public authService: AuthService,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.role = this.authService.userType;
    this.authService.userSubject.subscribe((user) => { this.user = user; });
  }

  ngOnInit(): void {
    this.fetchNewAppointments();
    if(this.role === 'A') {
      this.fetchNewUsers();
    }
  }
  
  fetchNewAppointments() {
    let newAppointments;
    if(this.authService.userType === 'A') {
      newAppointments = this.appointmentService.getAllNextAppointments()
    } else if(this.authService.userType === 'D') {
      newAppointments = this.appointmentService.getNextAppointmentsByDoctorId(this.user.id);
    } else {
      newAppointments = this.appointmentService.getNextAppointmentsByPatientId(this.user.id);
    }
    newAppointments.subscribe({
      next: (result: any) => {
        console.log(result);
      },
      error: (error: any) => { 
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
      }
    });
  }

  fetchNewUsers() {
    // to add new patient my doctor department
    this.userService.getAllNewUsers()
    .subscribe({
      next: (result: any) => {
        console.log(result);
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
      }
    });
  }
}
