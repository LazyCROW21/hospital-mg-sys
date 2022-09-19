import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/services/department.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { designationOptions } from '../dropdown-options';

@Component({
  selector: 'app-tranfer-doctor-dialog',
  templateUrl: './tranfer-doctor-dialog.component.html',
  styleUrls: ['./tranfer-doctor-dialog.component.css']
})
export class TranferDoctorDialogComponent implements OnInit {
  @Input()
  show = false;

  @Output()
  showChange = new EventEmitter<boolean>();

  loading = false;

  @Input('doctor')
  doctor: any = {
    id: 0,
    specialization: 'Loading...',
    experience: 'Loading...',
    departmentId: 0,
    designation: 'Loading...',
    user: {
      firstName: '',
      lastName: ''
    },
    department: {
      name: 'Loading...'
    }
  };
  tranferForm = new FormGroup({
    departmentId: new FormControl(null, [Validators.required]),
    designation: new FormControl(null, [Validators.required])
  });

  departments: any[] = [];
  designationOptions = designationOptions;

  @Output()
  transferEvent = new EventEmitter<string>();

  constructor(
    private departmentService: DepartmentService,
    private doctorService: DoctorService,
  ) { }

  ngOnInit(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (result) => {
        this.departments.splice(0, this.departments.length, ...<any[]>result);
      },
      error: (error) => {
        console.error(error);
        this.departments = [];
      }
    })
  }

  onSubmit() {
    if(this.tranferForm.invalid) {
      this.tranferForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.doctorService.moveDoctorByUserId(this.doctor.userId, this.tranferForm.value).subscribe({
      next: (result: any) => {
        this.loading = false;
        this.transferEvent.emit('transferSuccessful');
        this.doctor.departmentId = this.tranferForm.get('departmentId')?.value;
        this.doctor.designation = this.tranferForm.get('designation')?.value; 
        this.tranferForm.reset();
      },
      error: (error: any) => {
        console.error(error);
        this.loading = false;
        this.transferEvent.emit('transferFailed');
      },
    });
  }

  onVisibilityChange(event: any) {
    console.log(this.doctor);
    this.showChange.emit(event);
  }
}
