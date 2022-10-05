import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  isLoadingDoctors = false;
  dialog = {
    show: false,
    header: '',
    mode: ''
  };
  transferDialog = {
    show: false,
    doctor: {}
  };
  moveDoctorForm: FormGroup = new FormGroup({
    doctorId: new FormControl(null, [Validators.required]),
    departmentId: new FormControl(null, [Validators.required]),
    designation: new FormControl(null, [Validators.required]),
  });
  minDate = new Date();
  doctors: any[] = [];
  activeRow = 0;
  activeUser: any;
  doctorRowMenu: { label: string, icon: string }[] = [
    { label: 'View', icon: 'pi pi-eye' }
  ];

  constructor(
    public authService: AuthService,
    private doctorService: DoctorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let preferredDateTime = new Date();
    let mins = preferredDateTime.getMinutes();
    preferredDateTime.setMinutes(mins - (mins % 15) + 15);

    this.fetchDoctors();
    // and can manage doctors
    if (this.authService.userType === 'A' ) {
      this.doctorRowMenu.push(
        { label: 'Edit', icon: 'pi pi-user-edit' },
        { label: 'Transfer', icon: 'pi pi-arrow-up-right' },
        { label: 'Delete', icon: 'pi pi-times' }
      );
    }
  }

  onDoctorTableAction(event: any) {
    this.activeUser = this.doctors[event.index].user;
    this.activeUser.specialization = this.doctors[event.index].specialization;
    this.activeUser.experience = this.doctors[event.index].experience;
    switch (event.event) {
      case 'View':
        this.dialog.header = 'Doctor Details';
        this.dialog.mode = 'E';
        this.dialog.show = true;
        break;
      case 'Edit':
        this.router.navigateByUrl(`/dashboard/users/${this.doctors[event.index].user.id}`);
        break;
      case 'Transfer':
        this.transferDialog.doctor = this.doctors[event.index];
        this.transferDialog.show = true;
        break;
      case 'Delete':
        this.onDelete();
        break;
    }
  }

  onDelete() {
    this.confirmationService.confirm({
      acceptButtonStyleClass: 'p-button-danger',
      message: `Do you want to delete this user (${this.activeUser.firstName} ${this.activeUser.lastName})?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.userService.deleteUser(this.activeUser.id).subscribe({
          next: (reponse: any) => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'User deleted' });
            this.fetchDoctors();
          },
          error: (err: any) => {
            console.log(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
          }
        });
      },
      reject: (type: ConfirmEventType) => { }
    });
  }

  fetchDoctors() {
    this.isLoadingDoctors = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (result: any) => {
        console.log(result);
        this.doctors.splice(0, this.doctors.length, ...<any[]>result);
        this.isLoadingDoctors = false;
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        this.isLoadingDoctors = false;
      }
    });
  }

  onDoctorTransfer(tranferStatus: string) {
    switch (tranferStatus) {
      case 'transferSuccessful':
        this.transferDialog.show = false;
        this.messageService.add({ severity: 'success', summary: 'Tranferred', detail: 'Doctor moved!' });
        break;
      case 'transferFailed':
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
        break;
    }
  }
}
