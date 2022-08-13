import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doctor-cases',
  templateUrl: './doctor-cases.component.html',
  styleUrls: ['./doctor-cases.component.css']
})
export class DoctorCasesComponent implements OnInit {
  cases = [];
  constructor() { }

  ngOnInit(): void {
  }

}
