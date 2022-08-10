import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  activeTab: number = 0;
  showNewAccountForm: boolean = false;
  genderOptions = [
    { label: 'Male', value: 'M' },
    { label: 'Femail', value: 'F' }
  ];
  stateOptions = [
    { label: 'Gujarat', value: 'GJ' },
    { label: 'Maharashtra', value: 'MH' }
  ];
  maxDate = new Date();
  constructor() { }

  ngOnInit(): void {
  }

  openNewAccountForm() {
    this.showNewAccountForm = true;
  }
}
