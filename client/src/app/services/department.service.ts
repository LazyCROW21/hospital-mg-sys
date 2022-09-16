import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private http: HttpClient) { }

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
    return this.http.get(environment.apiURL + '/department/' + departmentId);
  }

  getAllDepartments() {
    return this.http.get(environment.apiURL + '/department');
  }

  getSubDepartments(departmentId: number) {
    return this.http.get(environment.apiURL + '/department/sub-departments/' + departmentId);
  }

  addDepartment(data: any) {
    return this.http.post(environment.apiURL + '/department', data);
  }

  updateDepartment(departmentId: number, data: any) {
    return this.http.patch(environment.apiURL + '/department/'+departmentId, data);
  }

  deleteDepartment(departmentId: number) {
    return this.http.delete(environment.apiURL + '/department/' + departmentId);
  }
}
