import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  isDoctor: boolean = true;
  isPatient: boolean = false;
  isAdmin: boolean = true;
  holderId: number = 1;
  newAppointmentCount: string = 'pi pi-spin pi-spinner';
  newPatientCount: string = 'pi pi-spin pi-spinner';
  newDoctorCount: string = 'pi pi-spin pi-spinner';
  loadingIcon: string = '';

  // accept, reject, cancel btn icons
  updateButtonIcons = {
    'rejected': 'pi pi-ban',
    'fixed': 'pi pi-check',
    'cancelled': 'pi pi-ban'
  };

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchNewAppointments();
    if(!this.isPatient) {
      this.fetchNewPatients();
      this.fetchNewDoctors();
    }
  }
  
  fetchNewAppointments() {
    let newAppointments;
    if(this.isAdmin) {
      newAppointments = this.appointmentService.getAllNextAppointments()
    } else if(this.isDoctor) {
      newAppointments = this.appointmentService.getNextAppointmentsByDoctorId(this.holderId);
    } else {
      newAppointments = this.appointmentService.getNextAppointmentsByPatientId(this.holderId);
    }
    newAppointments.subscribe({
      next: (result: any) => {
        this.newAppointmentCount = result.count.toString();
        console.log(result);
      },
      error: (error: any) => { 
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        this.newAppointmentCount = 'X';
      }
    });
  }

  fetchNewPatients() {
    // to add new patient my doctor department
    this.patientService.getAllNewPatients()
    .subscribe({
      next: (result: any) => {
        this.newPatientCount = result.count.toString();
        console.log(result);
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        this.newPatientCount = 'X';
      }
    });
  }

  fetchNewDoctors() {
    // to add new patient my doctor department
    this.doctorService.getAllNewDoctors()
    .subscribe({
      next: (result: any) => {
        this.newDoctorCount = result.count.toString();
        console.log(result);
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        this.newDoctorCount = 'X';
      }
    });
  }
}
