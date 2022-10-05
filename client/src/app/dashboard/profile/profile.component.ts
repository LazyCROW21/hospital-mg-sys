import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { differentField, matchField } from 'src/app/common/custom-validators';
import { genderOptions, stateOptions, specializationOptions } from 'src/app/common/dropdown-options';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  genderOptions = genderOptions;
  stateOptions = stateOptions;
  specializationOptions = specializationOptions;
  mode: 'A' | 'U' | 'M' | 'X' = 'X';
  readonly = true;
  maxDate = new Date();
  user: any = {};
  role: any = {};
  department: any = {};
  pageHeading = {
    'A': 'Admin',
    'U': 'User',
    'M': 'My',
    'X': ''
  };
  isSavingProfile = false;
  isChangingPWD = false;
  isSavingDoctorDetails = false;
  userType = '';
  profileStatus: 'X' | 'N' | 'A' | 'R' = 'A';
  profile = {
    'X': { severity: 'danger', label: 'Deleted' },
    'N': { severity: 'info', label: 'Applied' },
    'A': { severity: 'success', label: 'Active' },
    'R': { severity: 'warning', label: 'Rejected' }
  };

  userForm: FormGroup = new FormGroup({
    firstName: new FormControl('Loading...', [Validators.required, Validators.maxLength(40)]),
    lastName: new FormControl('Loading...', [Validators.required, Validators.maxLength(40)]),
    phone: new FormControl('Loading...', [Validators.required, Validators.pattern('[0-9]{10}')]),
    emergencyPhone: new FormControl('Loading...', [Validators.required, Validators.pattern('[0-9]{10}')]),
    gender: new FormControl('Loading...', [Validators.required]),
    dob: new FormControl(null, [Validators.required]),
    line1: new FormControl('Loading...', [Validators.required, Validators.maxLength(80)]),
    line2: new FormControl('Loading...', [Validators.required, Validators.maxLength(80)]),
    pincode: new FormControl('Loading...', [Validators.required, Validators.pattern('[0-9]{6}')]),
    city: new FormControl('Loading...', [Validators.required, Validators.maxLength(40)]),
    state: new FormControl('Loading...', [Validators.required]),
    email: new FormControl('Loading...', [Validators.required, Validators.email]),
  }, [matchField('pwd', 'confPwd'), differentField('phone', 'emergencyPhone')]);

  pwdChangeForm: FormGroup = new FormGroup({
    oldPwd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
    newPwd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
    confNewPwd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
  }, [matchField('newPwd', 'confNewPwd')]);

  doctorDetailForm: FormGroup = new FormGroup({
    experience: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(60)]),
    specialization: new FormControl(null, [Validators.required])
  });

  profileMenuIndex = 'BD';

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private departmentService: DepartmentService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe((urlArray) => {
      switch (urlArray[0].path) {
        case 'admins':
          this.mode = 'A';
          break;
        case 'users':
          this.mode = 'U';
          break;
        case 'profile':
          this.mode = 'M';
          break;
        default:
          this.mode = 'X';
      }
      if (this.mode === 'X') {
        this.router.navigateByUrl('/pagenotfound');
      } else if (this.mode === 'M') {
        this.authService.userSubject.subscribe((user) => {
          this.setUser(user);
          this.authService.roleSubject.subscribe((role) => {
            this.setUserRole(role);
          });
        });
      } else {
        this.route.params.subscribe((params) => {
          this.userService.getUserById(params['id']).subscribe({
            next: (user: any) => {
              console.log(user);
              this.setUser(user);
              this.setUserRole(user.roleDetails);
            },
            error: (err: any) => {
              console.log(err);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
            }
          })
        });
      }
    });
    // user's permission to edit
    if (
      (
        this.authService.userType === 'A' &&
        (
          this.authService.roleSubject.value.access.includes('MNG_U') || 
          this.authService.roleSubject.value.access.includes('SA')
        )
      ) ||
      this.user.id === this.authService.userSubject.value.id
    ) {
      this.readonly = false;
    }
  }

  onProfileMenuItemClick(menu: string) {
    this.profileMenuIndex = menu;
  }

  onChangePWD() {
    if (this.pwdChangeForm.invalid) {
      this.pwdChangeForm.markAllAsTouched();
      return;
    }
    this.isChangingPWD = true;
    const data = this.pwdChangeForm.getRawValue();
    delete data.confNewPwd;
    this.userService.changeUserPWD(this.user.id, data).subscribe({
      next: (resp) => {
        this.isChangingPWD = false;
        console.log(resp);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'password changed!'
        });
        this.pwdChangeForm.reset();
      },
      error: (err) => {
        this.isChangingPWD = false;
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Something went wrong'
        });
        this.pwdChangeForm.reset();
      }
    });
  }

  setUser(user: any) {
    this.user = user;
    this.userForm.patchValue(user);
    this.userForm.patchValue({
      dob: new Date(user.dob)
    });
    this.profileStatus = user.status;
  }

  setUserRole(role: any) {
    this.role = role;
    if (this.user.role === 'A') {
      this.userType = 'Admin';
    } else if (this.user.role === 'P') {
      this.userType = 'Patient';
    } else {
      this.userType = 'Doctor';
      this.doctorDetailForm.patchValue(role);
      this.departmentService.getDepartment(role.departmentId).subscribe({
        next: (resp) => {
          this.department = resp;
          console.log(resp);
          console.log(this.user);
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'Something went wrong'
          });
        }
      });
    } 
  }

  onProfileSave() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.isSavingProfile = true;
    this.userService.updateUser(this.user.id, this.userForm.value).subscribe({
      next: (resp) => {
        this.isSavingProfile = false;
        console.log(resp);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'changes saved!'
        });
        this.user = { ...this.user, ...this.userForm.getRawValue() }
        localStorage.setItem('USER', JSON.stringify(this.user));
      },
      error: (err) => {
        this.isSavingProfile = false;
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Something went wrong'
        });
      }
    });
  }

  onDoctorDetailUpdate() {
    if (this.doctorDetailForm.invalid) {
      this.doctorDetailForm.markAllAsTouched();
      return;
    }
    this.isSavingDoctorDetails = true;
    this.doctorService.updateDoctorById(this.role.id, this.doctorDetailForm.value).subscribe({
      next: (resp) => {
        this.isSavingDoctorDetails = false;
        console.log(resp);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'changes saved!'
        });
        this.role = { ...this.role, ...this.doctorDetailForm.getRawValue() }
        localStorage.setItem('ROLE', JSON.stringify(this.role));
      },
      error: (err) => {
        this.isSavingDoctorDetails = false;
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Something went wrong'
        });
      }
    });
  }

  onProfileReset() {
    this.userForm.patchValue(this.user);
    this.userForm.patchValue({
      dob: new Date(this.user.dob)
    });
  }
}
