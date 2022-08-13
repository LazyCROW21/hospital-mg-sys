import { Component, OnInit } from '@angular/core';
import { genderOptions, stateOptions, specializationOptions } from 'src/app/common/dropdown-options';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  genderOptions = genderOptions;
  stateOptions = stateOptions;
  specializationOptions = specializationOptions;
  maxDate = new Date();
  constructor() { }

  ngOnInit(): void {
  }

}
