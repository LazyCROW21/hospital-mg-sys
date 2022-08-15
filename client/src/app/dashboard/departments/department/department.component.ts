import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
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
  loadingIcon: string = '';
  showNewDepartmentForm: boolean = false;
  departmentId: number = 0;
  department: any = {
    name: 'loading..',
    description: 'loading..',
    parentDepartment: {
      name: 'loading..'
    }
  };
  departmentDoctors: any[]  = [];
  subDepartments: any[] = [];
  activeRow: number = 0;
  deptRowMenu: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye', command: () => this.goToDepartment()  },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Remove', icon: 'pi pi-trash' },
  ];

  doctorRowMenu: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye' },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Remove', icon: 'pi pi-trash' },
  ];

  newDepartmentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    parentDepartmentId: new FormControl(null)
  });
  
  constructor(
    private messageService: MessageService, 
    private departmentService: DepartmentService, 
    private doctorService: DoctorService, 
    private route: ActivatedRoute, 
    private router: Router
  ) { }
  
  fetchDepartment() {
    this.isLoadingSubDepartments = true;
    this.departmentService.getDepartment(this.departmentId).subscribe({
      next: (result) => {
        console.log(result);
        this.department = result;
        this.newDepartmentForm.patchValue({
          parentDepartmentId: this.department.id
        });
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
        if(error.status === 404) {
          this.router.navigateByUrl('/pagenotfound');
        }
      },
      complete: () => {
        this.isLoadingSubDepartments = false;
      }
    });
  }

  fetchDepartmentDoctors() {
    this.isLoadingDepartmentDoctors = true;
    this.doctorService.getDoctorByDepartmentId(this.departmentId).subscribe({
      next: (result) => {
        console.log(result);
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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.departmentId = params['id'];
      if (isNaN(this.departmentId) || Number(this.departmentId) < 1) {
        this.router.navigateByUrl('/pagenotfound');
      }
      this.fetchDepartment();
      this.fetchSubDepartments();
      this.fetchDepartmentDoctors();
    });
  }

  openMenu(rowIndex: number) {
    this.activeRow = rowIndex;
  }

  goToDepartment() {
    this.router.navigateByUrl(`/dashboard/departments/${this.subDepartments[this.activeRow].id}`);
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
        this.fetchSubDepartments();
      }
    });
  }
}
