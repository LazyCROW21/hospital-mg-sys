import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthService } from 'src/app/services/auth.service';
import { NoticeService } from 'src/app/services/notice.service';
import { ReportService } from 'src/app/services/report.service';
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
  noOfNewUsers = 0;
  noOfNewAppointments = 0;
  noOfNewReports = 0;
  readonly = true;

  // accept, reject, cancel btn icons
  updateButtonIcons = {
    'rejected': 'pi pi-ban',
    'fixed': 'pi pi-check',
    'cancelled': 'pi pi-ban'
  };

  generalNotice = {
    date: new Date(),
    subject: '',
    body: ''
  };

  doctorNotice = {
    date: new Date(),
    subject: '',
    body: ''
  };

  adminNotice = {
    date: new Date(),
    subject: '',
    body: ''
  };

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private reportService: ReportService,
    private userService: UserService,
    private messageService: MessageService,
    private noticeService: NoticeService
  ) {
    this.role = this.authService.userType;
    this.authService.userSubject.subscribe((user) => { this.user = user; });
  }

  ngOnInit(): void {
    this.fetchNewAppointments();
    this.fetchNewReports();
    switch(this.role) {
      case 'A':
        this.fetchNewUsers();
        this.fetchNotice('admin');
        this.fetchNotice('doctor');
        this.fetchNotice('patient');
        this.readonly = false;
        break;
      case 'D':
        this.fetchNotice('doctor');
        this.fetchNotice('patient');
        break;
      case 'P':
        this.fetchNotice('patient');
        break;
    }
  }

  fetchNotice(nType: 'patient' | 'doctor' | 'admin') {
    this.noticeService.getNotice(nType).subscribe({
      next: (result: any) => {
        if (result) {
          switch (nType) {
            case 'admin':
              this.adminNotice.subject = result.subject;
              this.adminNotice.body = result.body;
              this.adminNotice.date = new Date(result.date);
              break;
            case 'doctor':
              this.doctorNotice.subject = result.subject;
              this.doctorNotice.body = result.body;
              this.doctorNotice.date = new Date(result.date);
              break;
            case 'patient':
              this.generalNotice.subject = result.subject;
              this.generalNotice.body = result.body;
              this.generalNotice.date = new Date(result.date);
              break;
          }
        }
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

  putNotice(nType: 'patient' | 'doctor' | 'admin') {
    let data: any;
    switch (nType) {
      case 'admin':
        data = this.adminNotice;
        break;
      case 'doctor':
        data = this.doctorNotice;
        break;
      case 'patient':
        data = this.generalNotice;
        break;
    }
    delete data.date;
    this.noticeService.putNotice(nType, data).subscribe({
      next: (result: any) => {
        switch (nType) {
          case 'admin':
            this.adminNotice = result;
            break;
          case 'doctor':
            this.doctorNotice = result;
            break;
          case 'patient':
            this.generalNotice = result;
            break;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Notice updated',
          detail: 'Changes saved!'
        });
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Something went wrong'
        });
      }
    });
  }

  clearNotice(nType: 'patient' | 'doctor' | 'admin') {
    switch (nType) {
      case 'admin':
        this.adminNotice.subject = '';
        this.adminNotice.body = '';
        this.adminNotice.date = new Date();
        break;
      case 'doctor':
        this.doctorNotice.subject = '';
        this.doctorNotice.body = '';
        this.doctorNotice.date = new Date();
        break;
      case 'patient':
        this.generalNotice.subject = '';
        this.generalNotice.body = '';
        this.generalNotice.date = new Date();
        break;
    }
  }

  fetchNewAppointments() {
    let newAppointments;
    if (this.authService.userType === 'A') {
      newAppointments = this.appointmentService.getAllNextAppointments();
    } else if (this.authService.userType === 'D') {
      newAppointments = this.appointmentService.getNextAppointmentsByDoctorId(this.authService.roleSubject.value.id);
    } else {
      newAppointments = this.appointmentService.getNextAppointmentsByPatientId(this.authService.roleSubject.value.id);
    }
    newAppointments.subscribe({
      next: (result: any) => {
        this.noOfNewAppointments = result.count;
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

  fetchNewReports() {
    this.reportService.getNewReports(
      this.authService.userType,
      this.authService.roleSubject.value.id
    ).subscribe({
      next: (result: any) => {
        this.noOfNewReports = result.count;
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
    this.userService.getAllNewUsers()
      .subscribe({
        next: (result: any) => {
          this.noOfNewUsers = (<any[]>result).length;
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
