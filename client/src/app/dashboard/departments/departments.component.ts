import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  isLoadingDepartments: boolean = false;
  loadingIcon: string = '';
  showNewDepartmentForm: boolean = false;
  activeRow: number = 0;
  rowMenu: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye', command: () => this.goToDepartment() },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Remove', icon: 'pi pi-trash', command: () => this.onDelete() },
  ];
  departments: any[] = [];

  newDepartmentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    parentDepartmentId: new FormControl(null)
  });

  constructor(
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchDepartments();
  }

  openMenu(rowIndex: number) {
    this.activeRow = rowIndex;
  }

  goToDepartment() {
    this.router.navigateByUrl(`/dashboard/departments/${this.departments[this.activeRow].id}`);
  }

  fetchDepartments() {
    this.isLoadingDepartments = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (result) => {
        console.log(result);
        this.departments = <any[]>result;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
        this.departments = [];
        this.isLoadingDepartments = false;
      },
      complete: () => {
        this.isLoadingDepartments = false;
      }
    });
  }

  openDepartmentForm() {
    this.showNewDepartmentForm = true;
  }

  onSubmit() {
    this.loadingIcon = 'pi pi-spin pi-spinner';
    this.departmentService.addDepartment(this.newDepartmentForm.value).subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Department created',
          detail: 'Now you add staff to this department!'
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
        this.newDepartmentForm.reset();
        this.loadingIcon = '';
        this.showNewDepartmentForm = false;
        this.fetchDepartments();
      }
    });
  }

  onDelete() {
    this.confirmationService.confirm({
      acceptButtonStyleClass: 'p-button-danger',
      message: `Do you want to delete this department (${this.departments[this.activeRow].name})?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.departmentService.deleteDepartment(this.departments[this.activeRow].id).subscribe({
          next: (reponse: any) => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Department deleted' });
            this.fetchDepartments();
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
