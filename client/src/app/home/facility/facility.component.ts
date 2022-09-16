import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityComponent implements OnInit {

  departments: any[] = [];
  constructor(private publicService: PublicService) { }

  ngOnInit(): void {
    this.publicService.getAllDepartments().subscribe((departments) => {
      const depts = <any[]>departments;
      depts.forEach((dept) => {
        if(!dept.parentDepartmentId) {
          this.departments.push(dept);
        }
      })
    });
  }

}
