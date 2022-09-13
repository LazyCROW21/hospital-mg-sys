import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  isLoadingDepartments: boolean = false;
  loadingIcon: string = '';
  dialog = {
    show: false,
    heading: 'Add Department'
  }
  activeRow: number = 0;
  rowMenu: { label: string; icon: string }[] = [
    { label: 'View', icon: 'pi pi-eye' },
  ];
  departments: any[] = [];
  departmentTree: any[] = [];
  editDepartmentId = -1;
  departmentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    parentDepartmentId: new FormControl(null)
  });

  constructor(
    public authService: AuthService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchDepartments();
    if (this.authService.userType === 'A') {
      this.rowMenu.push(
        { label: 'Edit', icon: 'pi pi-cog' },
        { label: 'Remove', icon: 'pi pi-trash' }
      );
    }
  }

  onDepartmentTableAction(event: any) {
    console.log(event);
    this.activeRow = event.index;
    switch (event.event) {
      case 'View':
        this.goToDepartment();
        break;
      case 'Edit':
        this.editDepartmentId = event.data.id;
        this.departmentTree.splice(0, this.departmentTree.length)
        const rootDeptOption = {
          label: '-- Root --',
          data: null
        }
        this.departmentTree.push(rootDeptOption);
        let parentNodeId = -2;
        if (event.data.parentDepartmentId) {
          parentNodeId = event.data.parentDepartmentId;
        }
        const { roots, selectedNode } = this.departmentService.createDepartmentTree(this.departments, event.data.id, parentNodeId);
        this.departmentTree.push(...roots);
        console.log(this.departmentTree);
        this.departmentForm.patchValue({
          name: event.data.name,
          description: event.data.description,
          parentDepartmentId: event.data.parentDepartmentId ? selectedNode : rootDeptOption
        });
        this.dialog.heading = 'Edit Department';
        this.dialog.show = true;
        break;
      case 'Remove':
        this.onDelete();
        break;
    }
  }

  goToDepartment() {
    this.router.navigateByUrl(`/dashboard/departments/${this.departments[this.activeRow].id}`);
  }

  fetchDepartments() {
    this.isLoadingDepartments = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (result) => {
        this.departments.splice(0, this.departments.length, ...<any[]>result);
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
    this.editDepartmentId = -1;
    this.departmentTree.splice(0, this.departmentTree.length)
    const rootDeptOption = {
      label: '-- Root --',
      data: null
    }
    this.departmentTree.push(rootDeptOption);
    const { roots } = this.departmentService.createDepartmentTree(this.departments, -1, -2);
    this.departmentTree.push(...roots);
    this.departmentForm.reset({
      parentDepartmentId: rootDeptOption
    });
    this.dialog.heading = 'Add Department';
    this.dialog.show = true;
  }

  onSubmit() {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }
    const data = {
      name: this.departmentForm.get('name')?.value,
      description: this.departmentForm.get('description')?.value,
      parentDepartmentId: this.departmentForm.get('parentDepartmentId')?.value.data,
    }
    this.loadingIcon = 'pi pi-spin pi-spinner';
    let api;
    if (this.editDepartmentId === -1) {
      api = this.departmentService.addDepartment(data);
    } else {
      api = this.departmentService.updateDepartment(this.editDepartmentId, data);
    }
    api.subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary: this.editDepartmentId === -1 ? 'Department created' : 'Department update',
          detail: this.editDepartmentId === -1 ? 'Now you add staff to this department!' : 'Note: sub-departments are moved along'
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
        this.departmentForm.reset();
        this.loadingIcon = '';
        this.dialog.show = false;
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
        // switch (type) {
        //   case ConfirmEventType.REJECT:
        //     this.messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'Department not removed' });
        //     break;
        //   case ConfirmEventType.CANCEL:
        //     this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Department not removed' });
        //     break;
        // }
      }
    });
  }
}
