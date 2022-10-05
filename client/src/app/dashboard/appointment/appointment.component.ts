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
  isLoadingAppointments = false;
  dialog = {
    heading: '',
    show: false,
    mode: 'E'
  };
  showRejectDialog = false;
  reasonToReject = '';
  showAppointmentDetails: boolean = false;
  appointmentDetails: any = {};
  isAppointmentConcludedByUser = false;
  isAppointmentConcludedByOpposite = false;
  isSavingAppointment: boolean = false;
  minDate = new Date();
  doctorOptions: { label: string, value: number }[] = [];
  appointments: any[] = [];
  activeRow: number = 0;
  rowMenu: MenuItem[] = [];

  appointmentForm: FormGroup = new FormGroup({
    patientId: new FormControl('', [Validators.required]),
    doctorId: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required, Validators.maxLength(80)]),
    message: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    preferredDateTime: new FormControl(new Date(), [Validators.required]),
  });

  // accept, reject, cancel btn icons
  updateButtonIcons = {
    'rejected': 'pi pi-ban',
    'fixed': 'pi pi-check',
    'cancelled': 'pi pi-ban',
    'concluded': 'pi pi-check-square'
  };

  constructor(
    public authService: AuthService,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    let preferredDateTime = new Date();
    let mins = preferredDateTime.getMinutes();
    preferredDateTime.setMinutes(mins - (mins % 15) + 15);
    this.appointmentForm.patchValue({
      patientId: this.authService.roleSubject.value.id,
      preferredDateTime
    });
    this.fetchAppointments();
    if (this.authService.userType === 'P') {
      this.doctorService.getAllDoctors().subscribe((result) => {
        (<any[]>result).forEach((doctor) => {
          const label = `${doctor.user.firstName} ${doctor.user.lastName} (${doctor.department.name})`;
          this.doctorOptions.push({
            label, value: doctor.id
          });
        });
      });
      this.rowMenu.push(...[
        { label: 'View', icon: 'pi pi-eye', command: () => { this.openAppointmentDetails(); } },
        { label: 'Edit', icon: 'pi pi-cog', command: () => { this.onEditAppointment(); } },
        { label: 'Cancel', icon: 'pi pi-times', iconClass: 'text-red-400', command: () => { this.onChangeAppointmentStatus('cancelled'); } },
      ]);
    } else {
      this.rowMenu.push(...[
        { label: 'View', icon: 'pi pi-eye', iconClass: 'text-blue-400', command: () => { this.openAppointmentDetails(); } },
        { label: 'Accept', icon: 'pi pi-check', iconClass: 'text-green-400', command: () => { this.onChangeAppointmentStatus('fixed'); } },
        { label: 'Reject', icon: 'pi pi-times', iconClass: 'text-red-400', command: () => { this.onRejectAppointment(); } }
      ]);
    }
  }

  openMenu(rowIndex: number) {
    this.activeRow = rowIndex;
    this.appointmentDetails = this.appointments[rowIndex];
    switch (this.appointmentDetails.status) {
      case 'rejected':
      case 'cancelled':
        this.rowMenu = [
          { label: 'View', icon: 'pi pi-eye', iconClass: 'text-blue-400', command: () => { this.openAppointmentDetails(); } },
        ];
        break;
      case 'applied':
        if (this.authService.userType === 'P') {
          this.rowMenu = [
            { label: 'View', icon: 'pi pi-eye', command: () => { this.openAppointmentDetails(); } },
            { label: 'Edit', icon: 'pi pi-cog', command: () => { this.onEditAppointment(); } },
            { label: 'Cancel', icon: 'pi pi-times', iconClass: 'text-red-400', command: () => { this.onChangeAppointmentStatus('cancelled'); } },
          ];
        } else {
          this.rowMenu = [
            { label: 'View', icon: 'pi pi-eye', iconClass: 'text-blue-400', command: () => { this.openAppointmentDetails(); } },
            { label: 'Accept', icon: 'pi pi-check', iconClass: 'text-green-400', command: () => { this.onChangeAppointmentStatus('fixed'); } },
            { label: 'Reject', icon: 'pi pi-times', iconClass: 'text-red-400', command: () => { this.onRejectAppointment(); } }
          ];
        }
        break;
      case 'fixed':
        this.isAppointmentConcludedByUser = true;
        this.isAppointmentConcludedByOpposite = false;
        if (this.authService.userType === 'P') {
          this.rowMenu = [
            { label: 'View', icon: 'pi pi-eye', command: () => { this.openAppointmentDetails(); } },
            { label: 'Cancel', icon: 'pi pi-times', iconClass: 'text-red-400', command: () => { this.onChangeAppointmentStatus('cancelled'); } },
          ];
          if(!this.appointmentDetails.concludedByPatient) {
            this.isAppointmentConcludedByUser = false;
            this.rowMenu.push({ label: 'Conclude', icon: 'pi pi-check-square', iconClass: 'text-green-400', command: () => { this.onConclude(); } });
          }
          if(this.appointmentDetails.concludedByDoctor) {
            this.isAppointmentConcludedByOpposite = true;
          }
        } else {
          this.rowMenu = [
            { label: 'View', icon: 'pi pi-eye', iconClass: 'text-blue-400', command: () => { this.openAppointmentDetails(); } },
            { label: 'Reject', icon: 'pi pi-times', iconClass: 'text-red-400', command: () => { this.onRejectAppointment(); } }
          ];
          if(!this.appointmentDetails.concludedByDoctor) {
            this.isAppointmentConcludedByUser = false;
            this.rowMenu.push({ label: 'Conclude', icon: 'pi pi-check-square', iconClass: 'text-green-400', command: () => { this.onConclude(); } });
          }
          if(this.appointmentDetails.concludedByPatient) {
            this.isAppointmentConcludedByOpposite = true;
          }
        }
        break;
    }
  }

  openAppointmentForm() {
    this.dialog.heading = 'Apply for Appointment';
    this.dialog.mode = 'N';
    this.dialog.show = true;
  }

  openAppointmentDetails() {
    this.showAppointmentDetails = true;
  }

  onEditAppointment() {
    this.appointmentDetails = this.appointments[this.activeRow];
    if (this.appointmentDetails.status !== 'applied') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Denied!',
        detail: `You can't edit a ${this.appointmentDetails.status} appointment`
      });
      return;
    }
    this.appointmentForm.patchValue(this.appointmentDetails);
    // this.appointmentForm.patchValue({ preferredDateTime: new Date(this.appointmentDetails.preferredDateTime) });
    this.dialog.heading = 'Edit Appointment';
    this.dialog.mode = 'E';
    this.dialog.show = true;
  }

  onRejectAppointment() {
    this.dialog.show = false;
    this.showRejectDialog = true;
  }

  fetchAppointments() {
    let allAppointments;
    switch (this.authService.userType) {
      case 'A':
        allAppointments = this.appointmentService.getAllAppointments()
        break;
      case 'D':
        allAppointments = this.appointmentService.getAppointmentByDoctorId(this.authService.roleSubject.value.id);
        break;
      case 'P':
        allAppointments = this.appointmentService.getAppointmentByPatientId(this.authService.roleSubject.value.id);
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
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }
    this.isSavingAppointment = true;
    let api;
    let summary = '';
    let detail = '';
    if (this.dialog.mode === 'E') {
      api = this.appointmentService.editAppointment(this.appointmentDetails.id, this.appointmentForm.value);
      summary = 'Appointment Updated';
      detail = 'Changes saved!';
    } else {
      api = this.appointmentService.addAppointment(this.appointmentForm.value);
      summary = 'Appointment request sent';
      detail = 'You can check on the app or your email for updates!';
    }
    api.subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary,
          detail
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
        this.isSavingAppointment = false;
      },
      complete: () => {
        this.appointmentForm.reset();
        this.isSavingAppointment = false;
        this.dialog.show = false;
        this.fetchAppointments();
      }
    });
  }

  onChangeAppointmentStatus(status: 'fixed' | 'rejected' | 'cancelled' | 'concluded') {
    if (this.appointmentDetails.status === 'concluded' || this.appointmentDetails.status === 'cancelled') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Denied!',
        detail: `You can't modify a ${this.appointmentDetails.status} appointment`
      });
      return;
    }
    if (status === 'rejected' && (this.reasonToReject.length < 4 || this.reasonToReject.length > 255)) {
      return;
    }
    // original icon
    let orginalIcon = this.updateButtonIcons[status];
    // change to loading icon
    this.updateButtonIcons[status] = 'pi pi-spin pi-spinner';
    const data = {
      patientId: this.appointmentDetails.patientId,
      doctorId: this.appointmentDetails.doctorId,
      subject: this.appointmentDetails.subject,
      message: this.appointmentDetails.message,
      rejectMessage: status === 'rejected' ? this.reasonToReject : this.appointmentDetails.rejectMessage,
      preferredDateTime: this.appointmentDetails.preferredDateTime,
      status: status
    };
    this.appointmentService.changeAppointmentStatus(this.appointmentDetails.id, data)
      .subscribe({
        next: (result: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Appointment ' + status,
            detail: this.authService.userType === 'D' ? 'Your patient will be notified' : 'The hospital staff will be notified'
          });
          this.appointments[this.activeRow].status = status;
          // back to original icon
          this.updateButtonIcons[status] = orginalIcon;
          this.showRejectDialog = false;
          console.log(result);
        },
        error: (error: any) => {
          console.error(error.status);
          if (error.status === 400) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'Select valid Options'
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'Something went wrong'
            });
          }
          // back to original icon
          this.updateButtonIcons[status] = orginalIcon;
        },
      });
  }

  onConclude() {
    const role = this.authService.userType === 'D' ? 'doctor' : 'patient';
    if (this.appointmentDetails.status !== 'fixed') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Denied!',
        detail: `You can't conclude a ${this.appointmentDetails.status} appointment`
      });
      return;
    }

    // original icon
    let orginalIcon = this.updateButtonIcons['concluded'];
    // change to loading icon
    this.updateButtonIcons['concluded'] = 'pi pi-spin pi-spinner';
    const data: any = {};
    if(role === 'doctor') {
      data.concludedByDoctor = true; 
    } else {
      data.concludedByPatient = true;
    }
    this.appointmentService.concludeAppointment(role, this.appointmentDetails.id, data)
      .subscribe({
        next: (result: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Appointment ' + 'concluded',
            detail: this.authService.userType === 'D' ? 'Your patient will be notified' : 'The hospital staff will be notified'
          });
          if(role === 'doctor') {
            this.appointmentDetails.concludedByDoctor = true;
          } else {
            this.appointmentDetails.concludedByPatient = true;
          }
          // back to original icon
          this.updateButtonIcons['concluded'] = orginalIcon;
          console.log(result);
        },
        error: (error: any) => {
          console.error(error.status);
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'Something went wrong'
          });
          // back to original icon
          this.updateButtonIcons['concluded'] = orginalIcon;
        },
      });
  }
}
