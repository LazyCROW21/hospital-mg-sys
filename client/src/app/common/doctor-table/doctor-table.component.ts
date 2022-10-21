import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-doctor-table',
  templateUrl: './doctor-table.component.html',
  styleUrls: ['./doctor-table.component.css']
})
export class DoctorTableComponent implements OnInit {
  activeRow = 0;

  @ViewChild('dt')
  dataTable!: Table;

  @Input('doctors')
  doctors: any[] = [];

  @Input('menu')
  rowMenu: { label: string, icon: string }[] = [
    { label: 'View', icon: 'pi pi-eye' },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Delete', icon: 'pi pi-times' }
  ];

  doctorRowMenu: MenuItem[] = [];

  // constructor() { }

  @Output('onMenuAction') onMenuAction: EventEmitter<{
    event: string,
    data: any,
    index: number
  }> = new EventEmitter();

  ngOnInit(): void {
    this.rowMenu.forEach((menuItem) => {
      this.doctorRowMenu.push({
        label: menuItem.label,
        icon: menuItem.icon,
        command: () => { this.onMenuClick(menuItem.label); }
      })
    });
  }

  setActiveUser(rowIndex: number) {
    this.activeRow = rowIndex;
  }

  onMenuClick(event: string) {
    this.onMenuAction.emit({
      event,
      data: this.doctors[this.activeRow],
      index: this.activeRow
    });
  }

  print(event: any) {
    console.log(event);
  }

  doctorSort(event: SortEvent) {
    event.data?.sort((a: any, b: any) => {
      let result = 1;
      switch(event.field) {
        case 'name':
          let aName = <string>(a.user.firstName + a.user.lastName);
          let bName = <string>(b.user.firstName + b.user.lastName);
          result = aName.localeCompare(bName);
          break;
        case 'gender':
          let aG = <string>(a.user.gender);
          let bG = <string>(b.user.gender);
          result = aG.localeCompare(bG);
          break;
        case 'phone':
          let aP = <string>(a.user.phone);
          let bP = <string>(b.user.phone);
          result = aP.localeCompare(bP);
          break;
        case 'specialization':
          let aS = <string>(a.specialization);
          let bS = <string>(b.specialization);
          result = aS.localeCompare(bS);
          break;
      }
      return result * (event.order ?? 1);
    });
  }

  filterTable(event: any) {
    this.dataTable.filterGlobal(event.target.value, 'contains');
  }
}
