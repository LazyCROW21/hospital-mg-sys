import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  departments = [
    { id: 2, name: 'Brain Cancer', parent: 'Cancer' }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}