import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  isLoadingSubDepartments: boolean = false;
  isLoadingDepartmentDoctors: boolean = false;
  isUpdateButtonLoading = false;
  dialog = {
    show: false,
    heading: 'Add Sub Department',
    loading: false
  }
  departmentId: number = 0;
  parentDepartment = {
    id: -1,
    name: 'loading...'
  }
  departmentDoctors: any[] = [];
  subDepartments: any[] = [];
  activeRow: number = 0;
  editDepartmentId = -1;
  readonly = true;

  deptRowMenu: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye', command: () => this.goToDepartment() },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Remove', icon: 'pi pi-trash', command: () => this.onDelete() },
  ];

  doctorRowMenu: { label: string, icon: string }[] = [
    { label: 'View', icon: 'pi pi-eye' },
    { label: 'Remove', icon: 'pi pi-trash' },
  ];

  departmentForm: FormGroup = new FormGroup({
    name: new FormControl('loading...', [Validators.required, Validators.maxLength(40)]),
    description: new FormControl('loading...', [Validators.required, Validators.maxLength(255)]),
  });

  subDepartmentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    parentDepartmentId: new FormControl(null)
  });

  constructor(
    public authService: AuthService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.departmentId = params['id'];
      if (isNaN(this.departmentId) || Number(this.departmentId) < 1) {
        this.router.navigateByUrl('/pagenotfound');
      }
      this.subDepartmentForm.patchValue({ parentDepartmentId: this.departmentId });
      this.fetchDepartment();
      this.fetchSubDepartments();
      this.fetchDepartmentDoctors();
    });
    if(this.authService.userType === 'A') {
      this.readonly = false;
    }
  }

  fetchDepartment() {
    this.isLoadingSubDepartments = true;
    this.departmentService.getDepartment(this.departmentId).subscribe({
      next: (result: any) => {
        console.log(result);
        this.departmentForm.patchValue(result);
        this.subDepartmentForm.patchValue({
          parentDepartmentId: this.departmentId
        });
        this.parentDepartment = {
          id: result.parentDepartmentId,
          name: result.parentDepartment ? result.parentDepartment.name : '-- Root --'
        };
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
        this.subDepartments = [];
        this.isLoadingSubDepartments = false;
        if (error.status === 404) {
          this.router.navigateByUrl('/pagenotfound');
        }
      },
      complete: () => {
        this.isLoadingSubDepartments = false;
      }
    });
  }

  onUpdate() {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }
    this.isUpdateButtonLoading = true;
    this.departmentService.updateDepartment(this.departmentId, this.departmentForm.value).subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Department updated',
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
        this.isUpdateButtonLoading = false;
      },
      complete: () => {
        this.isUpdateButtonLoading = false;
      }
    });
  }

  fetchDepartmentDoctors() {
    this.isLoadingDepartmentDoctors = true;
    this.doctorService.getDoctorByDepartmentId(this.departmentId).subscribe({
      next: (result) => {
        this.departmentDoctors = <any[]>result;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
        this.departmentDoctors = [];
        this.isLoadingDepartmentDoctors = false;
      },
      complete: () => {
        this.isLoadingDepartmentDoctors = false;
      }
    });
  }

  fetchSubDepartments() {
    this.isLoadingSubDepartments = true;
    this.departmentService.getSubDepartments(this.departmentId).subscribe({
      next: (result) => {
        console.log(result);
        this.subDepartments.splice(0, this.subDepartments.length, ...<any[]>result);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
        this.subDepartments = [];
        this.isLoadingSubDepartments = false;
      },
      complete: () => {
        this.isLoadingSubDepartments = false;
      }
    });
  }

  onDepartmentTableAction(event: any) {
    this.activeRow = event.index;
    switch (event.event) {
      case 'View':
        this.goToDepartment();
        break;
      case 'Edit':
        this.editDepartmentId = event.data.id;
        this.subDepartmentForm.patchValue({
          name: event.data.name,
          description: event.data.description
        });
        this.dialog.heading = 'Edit Department';
        this.dialog.show = true;
        break;
      case 'Delete':
        this.onDelete();
        break;
    }
  }

  onDoctorTableAction(event: any) {
    this.activeRow = event.index;
    switch (event.event) {
      case 'View':
        this.router.navigateByUrl(`/dashboard/users/${this.departmentDoctors[this.activeRow].user.id}`);
        break;
      case 'Edit':
        break;
      case 'Delete':
        this.onDelete();
        break;
    }
  }

  goToDepartment() {
    this.router.navigateByUrl(`/dashboard/departments/${this.subDepartments[this.activeRow].id}`);
  }

  openDepartmentForm() {
    this.editDepartmentId = -1;
    this.dialog.show = true;
  }

  onSubmit() {
    if (this.subDepartmentForm.invalid) {
      this.subDepartmentForm.markAllAsTouched();
      return;
    }
    this.dialog.loading = true;
    let api;
    if (this.editDepartmentId === -1) {
      api = this.departmentService.addDepartment(this.subDepartmentForm.value);
    } else {
      api = this.departmentService.updateDepartment(this.editDepartmentId, this.subDepartmentForm.value);
    }
    api.subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary: this.editDepartmentId === -1 ? 'Department created' : 'Department update',
          detail: this.editDepartmentId === -1 ? 'Now you add staff to this department!' : 'Changes saved'
        });
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Something went wrong'
        });
        this.dialog.loading = false;
      },
      complete: () => {
        this.subDepartmentForm.reset();
        this.dialog.loading = false;
        this.dialog.show = false;
        this.fetchSubDepartments();
      }
    });
  }

  onDelete() {
    this.confirmationService.confirm({
      acceptButtonStyleClass: 'p-button-danger',
      message: `Do you want to delete this department (${this.subDepartments[this.activeRow].name})?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.departmentService.deleteDepartment(this.subDepartments[this.activeRow].id).subscribe({
          next: (reponse: any) => {
            this.messageService.add({ severity: 'success', summary: 'Delete', detail: 'Department deleted' });
            this.fetchSubDepartments();
          },
          error: (err: any) => {
            console.log(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'Department not removed' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Department not removed' });
            break;
        }
      }
    });
  }
}
