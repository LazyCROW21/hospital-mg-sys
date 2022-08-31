import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  holderId: number = 1;
  isLoadingAppointments: boolean = false;
  showNewAppointmentForm: boolean = false;
  showAppointmentDetails: boolean = false;
  appointmentDetails: any = {};
  loadingIcon: string = '';
  minDate = new Date();
  doctorOptions:{ label: string, value: number }[] = [];
  appointments: any[] = [];
  activeRow: number = 0;
  rowMenu: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye', command: () => { this.openAppointmentDetails(); } },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Remove', icon: 'pi pi-trash' },
  ];

  newAppointmentForm: FormGroup = new FormGroup({
    patientId: new FormControl('', [Validators.required]),
    doctorId: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required, Validators.maxLength(80)]),
    message: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    preferredDateTime: new FormControl(null, [Validators.required]),
    // status: new FormControl('', [Validators.required])
  });

  // accept, reject, cancel btn icons
  updateButtonIcons = {
    'rejected': 'pi pi-ban',
    'fixed': 'pi pi-check',
    'cancelled': 'pi pi-ban'
  };

  constructor(
    public authService: AuthService,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const preferredDateTime = new Date();
    const mins = this.minDate.getMinutes();
    preferredDateTime.setMinutes(mins - (mins % 15) + 15);
    this.newAppointmentForm.patchValue({ 
      patientId: this.holderId,
      preferredDateTime
    });
    this.fetchAppointments();
    this.doctorService.getAllDoctors().subscribe((result) => {
      (<any[]>result).forEach((doctor) => {
        const label = `${doctor.user.firstName} ${doctor.user.lastName} (${doctor.department.name})`;
        this.doctorOptions.push({
          label, value: doctor.id
        });
      });
    });
  }

  openMenu(rowIndex: number) {
    this.activeRow = rowIndex;
  }

  openAppointmentForm() {
    this.showNewAppointmentForm = true;
  }

  openAppointmentDetails () {
    this.appointmentDetails = this.appointments[this.activeRow];
    this.showAppointmentDetails = true;
  }
  
  fetchAppointments() {
    let allAppointments;
    switch(this.authService.userType) {
      case 'A':
        allAppointments = this.appointmentService.getAllAppointments()
        break;
      case 'D':
        allAppointments = this.appointmentService.getAppointmentByDoctorId(this.holderId);
        break;
      case 'P':
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
    if(this.newAppointmentForm.invalid) {
      this.newAppointmentForm.markAllAsTouched();
      return;
    }
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

  onChangeAppointmentStatus(status: 'fixed'|'rejected'|'cancelled') {
    // original icon
    let orginalIcon = this.updateButtonIcons[status];
    // change to loading icon
    this.updateButtonIcons[status] = 'pi pi-spin pi-spinner';
    this.appointmentService.changeAppointmentStatus(this.appointmentDetails.id, { status })
    .subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Appointment '+status,
          detail: this.authService.userType === 'D' ? 'Your patient will be notified' : 'The hospital staff will be notified'
        });
        this.appointments[this.activeRow].status = status;
        // back to original icon
        this.updateButtonIcons[status] = orginalIcon;
        console.log(result);
      },
      error: (error: any) => { 
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Something went wrong'
        });
        // back to original icon
        this.updateButtonIcons[status] = orginalIcon;
      },
    });
  }
}
