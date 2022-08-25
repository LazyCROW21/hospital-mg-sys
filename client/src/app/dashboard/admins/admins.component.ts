import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { differentField } from 'src/app/common/custom-validators';
import { AdminService } from 'src/app/services/admin.service';
import { genderOptions, accessOptions, stateOptions } from '../../common/dropdown-options';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {
  isLoadingAdmins: boolean = false;
  loadingIcon: string = '';
  showAdminForm: boolean = false;
  activeRow: number = 0;
  maxDate = new Date();
  genderOptions = genderOptions;
  stateOptions = stateOptions;
  accessOptions = accessOptions;
  rowMenu: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye', command: () => this.goToAdmin() },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Remove', icon: 'pi pi-trash', command: () => this.onDelete() },
  ];
  admins: any[] = [
    { id: 2, name: 'Brain Cancer', parent: 'Cancer' },
    { id: 1, name: 'Liver Cancer', parent: 'Cancer' }
  ];

  newAdminForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
    emergencyPhone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
    gender: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    line1: new FormControl('', [Validators.required, Validators.maxLength(80)]),
    line2: new FormControl('', [Validators.required, Validators.maxLength(80)]),
    pincode: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{6}')]),
    city: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    state: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('A', [Validators.required]),
    access: new FormControl(null, [Validators.required]),
  }, [differentField('phone', 'emergencyPhone')]);

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchAdmins();
  }

  openMenu(rowIndex: number) {
    this.activeRow = rowIndex;
  }

  goToAdmin() {
    this.router.navigateByUrl(`/dashboard/admins/${this.admins[this.activeRow].id}`);
  }

  fetchAdmins() {
    this.isLoadingAdmins = true;
    this.adminService.getAllAdmins().subscribe({
      next: (result) => {
        console.log(result);
        this.admins = <any[]>result;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
        this.admins = [];
        this.isLoadingAdmins = false;
      },
      complete: () => {
        this.isLoadingAdmins = false;
      }
    });
  }

  openAdminForm() {
    this.showAdminForm = true;
  }

  onSubmit() {
    console.log(this.newAdminForm.value);
    if(this.newAdminForm.invalid) {
      this.newAdminForm.markAllAsTouched();
      return;
    }
    this.loadingIcon = 'pi pi-spin pi-spinner';
    this.adminService.createAdmin(this.newAdminForm.value).subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Admin created',
          detail: 'Login credentials sent via e-mail!'
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
        this.newAdminForm.reset();
        this.loadingIcon = '';
        this.showAdminForm = false;
        this.fetchAdmins();
      }
    });
  }

  onDelete() {
    this.confirmationService.confirm({
      acceptButtonStyleClass: 'p-button-danger',
      message: `Do you want to delete this department (${this.admins[this.activeRow].name})?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        // this.adminService.deleteAdmin(this.departments[this.activeRow].id).subscribe({
        //   next: (reponse: any) => {
        //     this.messageService.add({ severity: 'success', summary: 'Delete', detail: 'Admin deleted' });
        //     this.fetchAdmins();
        //   },
        //   error: (err: any) => {
        //     console.log(err);
        //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
        //   }
        // });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'Admin not removed' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Admin not removed' });
            break;
        }
      }
    });
  }
}
