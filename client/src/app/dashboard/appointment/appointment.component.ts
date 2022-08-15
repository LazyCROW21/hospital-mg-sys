import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  isDoctor: boolean = false;
  isPatient: boolean = false;
  isAdmin: boolean = true;
  holderId: number = 1;
  isLoadingAppointments: boolean = false;
  showNewAppointmentForm: boolean = false;
  loadingIcon: string = '';
  minDate = new Date();
  doctorOptions:{ label: string, value: number }[] = [
    { label: 'Doctor 1', value: 1 },
    { label: 'Doctor 2', value: 2 },
    { label: 'Doctor 3', value: 3 }
  ];

  appointments: any[] = [];

  rowMenu: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye' },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Remove', icon: 'pi pi-trash' },
  ];

  newAppointmentForm: FormGroup = new FormGroup({
    patientId: new FormControl('', [Validators.required]),
    doctorId: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required, Validators.maxLength(80)]),
    message: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    preferredDateTime: new FormControl('', [Validators.required]),
    // status: new FormControl('', [Validators.required])
  });

  constructor(
    private appointmentService: AppointmentService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.newAppointmentForm.patchValue({ patientId: this.holderId });
    this.fetchAppointments();
  }

  openAppointmentForm() {
    this.showNewAppointmentForm = true;
  }
  
  fetchAppointments() {
    let allAppointments;
    if(this.isAdmin) {
      allAppointments = this.appointmentService.getAllAppointments()
    } else if(this.isDoctor) {
      allAppointments = this.appointmentService.getAppointmentByDoctorId(this.holderId);
    } else {
      allAppointments = this.appointmentService.getAppointmentByPatientId(this.holderId);
    }
    this.isLoadingAppointments = true;
    allAppointments.subscribe({
      next: (result: any) => {
        console.log(result);
        this.appointments.splice(0, this.appointments.length, ...<any[]>result);
      },
      error: (error: any) => { 
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        this.isLoadingAppointments = false;
      },
      complete: () => {
        this.isLoadingAppointments = false;
      }
    });
  }

  onSubmit() {
    this.loadingIcon = 'pi pi-spin pi-spinner';
    this.appointmentService.addAppointment(this.newAppointmentForm.value).subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Appointment request sent',
          detail: 'You can check on the app or your email for updates!'
        });
        console.log(result);
      },
      error: (error: any) => { 
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Something went wrong'
        });
        this.loadingIcon = '';
      },
      complete: () => {
        this.newAppointmentForm.reset();
        this.loadingIcon = '';
        this.showNewAppointmentForm = false;
        this.fetchAppointments();
      }
    });
  }
}
