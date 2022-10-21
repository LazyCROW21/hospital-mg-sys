import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-department-table',
  templateUrl: './department-table.component.html',
  styleUrls: ['./department-table.component.css']
})
export class DepartmentTableComponent implements OnInit {
  activeRow = 0;
  
  @Input('departments')
  departments: any[] = [];

  @Input('menu')
  rowMenu: { label: string, icon: string }[] = [
    { label: 'View', icon: 'pi pi-eye' },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Remove', icon: 'pi pi-trash' },
  ];

  departmentRowMenu: MenuItem[] = [];

  @Output('onMenuAction') onMenuAction: EventEmitter<{
    event: string,
    data: any,
    index: number
  }> = new EventEmitter();

  // constructor() { }

  ngOnInit(): void {
    this.rowMenu.forEach((menuItem) => {
      this.departmentRowMenu.push({
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
      data: this.departments[this.activeRow],
      index: this.activeRow
    });
  }
}
