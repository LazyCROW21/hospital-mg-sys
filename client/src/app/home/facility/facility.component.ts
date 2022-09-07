import { Component, OnInit } from '@angular/core';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityComponent implements OnInit {

  departments: any[] = [];
  constructor(private departmentService: DepartmentService) { }

  ngOnInit(): void {
    this.departmentService.getAllDepartments().subscribe((departments) => {
      const depts = <any[]>departments;
      depts.forEach((dept) => {
        if(!dept.parentDepartmentId) {
          this.departments.push(dept);
        }
      })
    });
  }

}
