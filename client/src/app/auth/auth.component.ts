import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { matchField, differentField } from '../common/custom-validators';
import { genderOptions, specializationOptions, stateOptions } from '../common/dropdown-options';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  roleType: 'P' | 'D' = 'P';
  showNewAccountForm: boolean = false;
  genderOptions = genderOptions;
  stateOptions = stateOptions;
  specializationOptions = specializationOptions;
  loadingIcon: string = '';

  maxDate = new Date();

  loginError: string = '';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    pwd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)])
  });

  newUserForm: FormGroup = new FormGroup({
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
    pwd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
    confPwd: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
    role: new FormControl('P', [Validators.required]),
    // optional
    experience: new FormControl(null, [Validators.min(0), Validators.max(60)]),
    specialization: new FormControl(null)
  }, [matchField('pwd', 'confPwd'), differentField('phone', 'emergencyPhone')]);

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void { }

  onRoleChange() {
    if (this.roleType === 'D') {
      this.newUserForm.patchValue({ 'role': 'D' });
      this.newUserForm.get('experience')?.addValidators([Validators.required]);
      this.newUserForm.get('specialization')?.addValidators([Validators.required]);
    } else {
      this.newUserForm.patchValue({ 'role': 'P' });
      this.newUserForm.get('experience')?.removeValidators([Validators.required]);
      this.newUserForm.get('specialization')?.removeValidators([Validators.required]);
    }
  }

  openNewAccountForm() {
    this.showNewAccountForm = true;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.authService.setUser(response.user, response.role, true);
          localStorage.setItem('ACCESS_TOKEN', response.accessToken);
          localStorage.setItem('REFRESH_TOKEN', response.refreshToken);
          localStorage.setItem('USER', JSON.stringify(response.user));
          localStorage.setItem('ROLE', JSON.stringify(response.role));
          this.loginForm.get('pwd')?.reset();
          this.router.navigateByUrl('/dashboard');
        },
        error: (error: any) => {
          console.log(error);
          if (error.status === 401) {
            this.loginError = 'Invalid email / password';
          }
          this.loginForm.get('pwd')?.reset();
          this.loginError = 'Something went wrong!';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onSubmit() {
    if(this.newUserForm.invalid) {
      this.newUserForm.markAllAsTouched();
      return;
    }
    this.loadingIcon = 'pi pi-spin pi-spinner';
    this.authService.createUser(this.newUserForm.value).subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Account created',
          detail: 'Now you can login!'
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
      },
      complete: () => {
        this.newUserForm.reset();
        this.newUserForm.patchValue({ 'role': this.roleType === 'P' ? 'P' : 'D' });
        this.loadingIcon = '';
        this.showNewAccountForm = false;
      }
    });
    console.log(this.newUserForm.value);
  }
}
