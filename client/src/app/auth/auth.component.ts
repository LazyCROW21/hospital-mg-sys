import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { matchField } from '../common/custom-validators';
import { genderOptions, specializationOptions, stateOptions } from '../common/dropdown-options';
import { createUser } from '../common/types/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  activeTab: number = 0;
  showNewAccountForm: boolean = false;
  genderOptions = genderOptions;
  stateOptions = stateOptions;
  specializationOptions = specializationOptions;
  loadingIcon: string = '';

  maxDate = new Date();

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
    experience: new FormControl(null, [Validators.min(0), Validators.max(60)]),
    specialization: new FormControl(null, [])
  }, [matchField('pwd', 'confPwd')]);

  constructor(private authService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void { }

  onRoleChange(event: any) {
    if (event.index === 1) {
      this.newUserForm.patchValue({ 'role': 'D' });
      this.newUserForm.get('experience')?.addValidators(Validators.required);
      this.newUserForm.get('specialization')?.addValidators(Validators.required);
    } else {
      this.newUserForm.patchValue({ 'role': 'P' });
      this.newUserForm.get('experience')?.removeValidators(Validators.required);
      this.newUserForm.get('specialization')?.removeValidators(Validators.required);
    }
  }

  openNewAccountForm() {
    this.showNewAccountForm = true;
  }

  onSubmit() {
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
        this.newUserForm.patchValue({ 'role': this.activeTab === 0 ? 'P' : 'D' });
        this.loadingIcon = '';
        this.showNewAccountForm = false;
      }
    });
    console.log(this.newUserForm.value);
  }
}
