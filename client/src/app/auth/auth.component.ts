import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { genderOptions, specializationOptions, stateOptions } from '../common/dropdown-options';
import { createUser } from '../common/types/user';

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
  
  maxDate = new Date();
  newUserModel: createUser;

  newUserForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    emergencyPhone: new FormControl(''),
    gender: new FormControl(''),
    dob: new FormControl(''),
    line1: new FormControl(''),
    line2: new FormControl(''),
    pincode: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    email: new FormControl(''),
    pwd: new FormControl(''),
    role: new FormControl('')
  });

  constructor() {
    this.newUserModel = {
      firstName: '',
      lastName:  '',
      phone:  '',
      emergencyPhone: '',
      gender:  '',
      dob: '',
      line1: '',
      line2: '',
      pincode: '',
      city: '',
      state: '',
      email: '',
      pwd: '',
      role: 'P'
    }
  }

  ngOnInit(): void {
  }

  onRoleChange(event: any) {
    this.newUserModel.role = event.index === 0 ? 'P' : 'D';
  }

  openNewAccountForm() {
    this.showNewAccountForm = true;
  }

  onSubmit() {
    console.log(this.newUserForm.value);
  }
}
