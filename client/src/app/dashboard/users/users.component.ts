import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { designationOptions } from 'src/app/common/dropdown-options';
import { DepartmentService } from 'src/app/services/department.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  isLoadingNewUsers = false;
  isLoadingDoctors = false;
  isLoadingPatients = false;
  dialog = {
    show: false,
    header: '',
    mode: ''
  };
  showMoveDoctorDialog = false;
  isLoadingMoveDoctor = false;
  activeRow = 0;
  activeUser: any;
  newUsers = <any>[];
  doctors = <any>[];
  patients = <any>[];
  newUserMenu: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye', iconClass: 'text-blue-400', command: () => { this.openNewUserRequest(); } },
    { label: 'Accept', icon: 'pi pi-check', iconClass: 'text-green-400', command: () => { this.commitUserStatus('A'); } },
    { label: 'Reject', icon: 'pi pi-times', iconClass: 'text-red-400', command: () => { this.commitUserStatus('R'); } }
  ];
  patientTableMenu: { label: string, icon: string }[] = [
    { label: 'View', icon: 'pi pi-eye' },
    // { label: 'Edit', icon: 'pi pi-cog', },
    { label: 'Delete', icon: 'pi pi-times' }
  ];
  doctorRowMenu: { label: string, icon: string }[] = [
    { label: 'View', icon: 'pi pi-eye' },
    // { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Delete', icon: 'pi pi-times' }
  ];
  departmentOptions: any[] = [];
  designationOptions = designationOptions;
  commitButtonIcons = {
    'R': 'pi pi-ban',
    'A': 'pi pi-check',
  };

  moveDoctorForm: FormGroup = new FormGroup({
    doctorId: new FormControl(null, [Validators.required]),
    departmentId: new FormControl(null, [Validators.required]),
    designation: new FormControl(null, [Validators.required]),
  });

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private departmentService: DepartmentService,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.fetchNewUsers();
    this.departmentService.getAllDepartments().subscribe({
      next: (result: any) => {
        this.departmentOptions.push(...result);
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Something went wrong'
        });
      },
    });
  }

  setActiveUser(rowIndex: number) {
    this.activeRow = rowIndex;
  }

  onPatientTableAction(event: any) {
    this.activeUser = this.patients[event.index].user;
    switch (event.event) {
      case 'View':
        this.dialog.header = 'Patient Details';
        this.dialog.mode = 'E';
        this.dialog.show = true;
        break;
      case 'Edit':
        break;
      case 'Delete':
        this.onDelete();
        break;
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
        break;
      case 'Delete':
        this.onDelete();
        break;
    }
  }

  openNewUserRequest() {
    this.activeUser = this.newUsers[this.activeRow];
    if(this.activeUser.role === 'D') {
      this.activeUser.specialization = 'Loading...';
      this.activeUser.experience = 'Loading...';
      this.doctorService.getDoctorByUserId(this.activeUser.id).subscribe({
        next: (doctor: any) => {
          this.activeUser.specialization = doctor.specialization;
          this.activeUser.experience = doctor.experience;
        },
        error: () => {
          this.activeUser.specialization = 'Error!';
          this.activeUser.experience = 'Error!';
        }
      });
    }
    this.dialog.header = 'New User Request';
    this.dialog.mode = 'N';
    this.dialog.show = true;
  }

  onTabChange(event: any) {
    switch (event.index) {
      case 0:
        this.fetchNewUsers();
        break;
      case 1:
        this.fetchAllPatients();
        break;
      case 2:
        this.fetchAllDoctors();
        break;
    }
  }

  commitUserStatus(status: 'A' | 'R') {
    this.activeUser = this.newUsers[this.activeRow];
    console.log(this.activeUser);
    // original icon
    let orginalIcon = this.commitButtonIcons[status];
    // change to loading icon
    this.commitButtonIcons[status] = 'pi pi-spin pi-spinner';
    this.userService.commitUser(this.activeUser.id, status)
      .subscribe({
        next: (result: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'User ' + (status === 'A' ? 'Accepted' : 'Rejected'),
            detail: status === 'A' ? 'Now the user can login' : 'Rejection mail send to user'
          });
          this.fetchNewUsers();
          // back to original icon
          this.commitButtonIcons[status] = orginalIcon;
          this.dialog.show = false;
          if(this.activeUser.role === 'D' && status === 'A') {
            this.showMoveDoctorDialog = true;
          }
        },
        error: (error: any) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'Something went wrong'
          });
          // back to original icon
          this.commitButtonIcons[status] = orginalIcon;
        },
      });
  }

  onMoveDoctor() {
    this.moveDoctorForm.patchValue({ 'doctorId': this.activeUser.id });
    if(this.moveDoctorForm.invalid) {
      this.moveDoctorForm.markAllAsTouched();
      return;
    }
    this.isLoadingMoveDoctor = true;
    const data = {
      departmentId: this.moveDoctorForm.get('departmentId')?.value,
      designation: this.moveDoctorForm.get('designation')?.value,
    };
    this.doctorService.moveDoctorByUserId(this.activeUser.id, data)
    .subscribe({
      next: (result) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Moved',
          detail: 'Doctor transferred!' 
        });
        this.isLoadingMoveDoctor = false;
        this.showMoveDoctorDialog = false;
      },
      error: (error) => {
        this.isLoadingMoveDoctor = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
      }
    });
  }

  fetchNewUsers() {
    this.isLoadingNewUsers = true;
    this.userService.getAllNewUsers().subscribe({
      next: (result) => {
        console.log(result);
        this.newUsers.splice(0, this.newUsers.length, ...<any[]>result);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
        this.isLoadingNewUsers = false;
      },
      complete: () => {
        this.isLoadingNewUsers = false;
      }
    });
  }

  fetchAllDoctors() {
    this.isLoadingDoctors = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (result) => {
        console.log(result);
        this.doctors.splice(0, this.doctors.length, ...<any[]>result);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
        this.isLoadingDoctors = false;
      },
      complete: () => {
        this.isLoadingDoctors = false;
      }
    });
  }

  fetchAllPatients() {
    this.isLoadingPatients = true;
    this.patientService.getAllPatients().subscribe({
      next: (result) => {
        console.log(result);
        this.patients.splice(0, this.patients.length, ...<any[]>result);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
        this.isLoadingPatients = false;
      },
      complete: () => {
        this.isLoadingPatients = false;
      }
    });
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
            if (this.activeUser.role === 'D') {
              this.fetchAllDoctors();
            } else {
              this.fetchAllPatients();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        // switch (type) {
        //   case ConfirmEventType.REJECT:
        //     this.messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'User not removed' });
        //     break;
        //   case ConfirmEventType.CANCEL:
        //     this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'User not removed' });
        //     break;
        // }
      }
    });
  }
}
