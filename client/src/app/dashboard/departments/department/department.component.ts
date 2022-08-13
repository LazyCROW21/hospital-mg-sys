import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departmentId: number = 0;
  constructor(private route: ActivatedRoute, private router: Router) {
    
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.departmentId = params['id'];
      if(isNaN(this.departmentId) || Number(this.departmentId) < 1) {
        this.router.navigateByUrl('/pagenotfound');
      }
    });
  }
}
