import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  constructor(private http: HttpClient) {}

  getAllDepartments() {
    return this.http.get(environment.apiURL + '/public/department');
  }

  getSubDepartments(departmentId: number) {
    return this.http.get(environment.apiURL + '/public/sub-departments/' + departmentId);
  }
}
