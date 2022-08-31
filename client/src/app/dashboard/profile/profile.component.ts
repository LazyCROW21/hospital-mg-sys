import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { differentField, matchField } from 'src/app/common/custom-validators';
import { genderOptions, stateOptions, specializationOptions } from 'src/app/common/dropdown-options';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
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
  mode: 'A'|'U'|'P'|'D'|'M'|'X' = 'X';
  maxDate = new Date();
  user: any = {};
  pageHeading = {
    'A': 'Admin',
    'U': 'User',
    'P': 'Patient',
    'D': 'Doctor',
    'M': 'My',
    'X': ''
  };
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
    dob: new FormControl('Loading...', [Validators.required]),
    line1: new FormControl('Loading...', [Validators.required, Validators.maxLength(80)]),
    line2: new FormControl('Loading...', [Validators.required, Validators.maxLength(80)]),
    pincode: new FormControl('Loading...', [Validators.required, Validators.pattern('[0-9]{6}')]),
    city: new FormControl('Loading...', [Validators.required, Validators.maxLength(40)]),
    state: new FormControl('Loading...', [Validators.required]),
    email: new FormControl('Loading...', [Validators.required, Validators.email]),
  }, [matchField('pwd', 'confPwd'), differentField('phone', 'emergencyPhone')]);

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe((urlArray) => {
      urlArray.forEach((url) => {
        console.log(url);
        if (url.path === 'admins') {
          this.mode = 'A';
        } else if (url.path === 'users') {
          this.mode = 'U';
        } else if (url.path === 'doctors') {
          this.mode = 'D';
        } else if (url.path === 'patients') {
          this.mode = 'P';
        } else if (url.path === 'profile') {
          this.mode = 'M';
        }
      });
      if (this.mode === 'X') {
        this.router.navigateByUrl('/pagenotfound');
      } else if (this.mode === 'M') {
        this.authService.userSubject.subscribe((user) => {
          this.user = user;
        });
      } else {
        this.route.params.subscribe((params) => {
          let api;
          switch (this.mode) {
            case 'A':
              api = this.adminService.getAdminById(params['id']);
              break;
            case 'U':
              api = this.userService.getAllNewUsers();
              break;
            case 'D':
              api = this.doctorService.getDoctorById(params['id']);
              break;
            case 'P':
              api = this.patientService.getPatientById(params['id']);
              break;
          }
          api?.subscribe({
            next: (reponse: any) => {
              console.log(reponse);
            },
            error: (err: any) => {
              console.log(err);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
            }
          })
        });
      }
    });
  }

}
