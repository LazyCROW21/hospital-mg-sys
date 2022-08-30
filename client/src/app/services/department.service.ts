import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  baseHeader: HttpHeaders;
  constructor(private http: HttpClient) {
    this.baseHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  createDepartmentTree(departments: any[], excludeSubtree: number, selectedNodeId: number) {
    const departmentList = [];
    let map: any = {}, node: any, roots: any[] = [];
    let selectedNode;

    for (let i = 0; i < departments.length; i += 1) {
      map[departments[i].id] = i; // initialize the map
      departmentList.push({
        label: departments[i].name,
        data: departments[i].id,
        parentDepartmentId: departments[i].parentDepartmentId,
        children: <any[]>[]
      }); // initialize the children
      if(departments[i].id === selectedNodeId) {
        selectedNode = departmentList[i];
      }
    }

    for (let i = 0; i < departmentList.length; i += 1) {
      node = departmentList[i];
      if(node.data === excludeSubtree) {
        continue;
      }
      if (node.parentDepartmentId !== null) {
        // if you have dangling branches check that map[node.parentId] exists
        departmentList[map[node.parentDepartmentId]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return { roots, selectedNode};
  }

  getDepartment(departmentId: number) {
    return this.http.get(environment.apiURL + '/department/' + departmentId, { headers: this.baseHeader });
  }

  getAllDepartments() {
    return this.http.get(environment.apiURL + '/department', { headers: this.baseHeader });
  }

  getSubDepartments(departmentId: number) {
    return this.http.get(environment.apiURL + '/department/sub-departments/' + departmentId, { headers: this.baseHeader });
  }

  addDepartment(data: any) {
    return this.http.post(environment.apiURL + '/department', data, { headers: this.baseHeader });
  }

  deleteDepartment(departmentId: number) {
    return this.http.delete(environment.apiURL + '/department/' + departmentId, { headers: this.baseHeader });
  }
}
