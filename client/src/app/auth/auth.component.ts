import { Component, OnInit } from '@angular/core';
import { genderOptions, specializationOptions, stateOptions } from '../common/dropdown-options';

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
  constructor() { }

  ngOnInit(): void {
  }

  openNewAccountForm() {
    this.showNewAccountForm = true;
  }
}
