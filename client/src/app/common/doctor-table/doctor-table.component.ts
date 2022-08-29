import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-doctor-table',
  templateUrl: './doctor-table.component.html',
  styleUrls: ['./doctor-table.component.css']
})
export class DoctorTableComponent implements OnInit {
  activeRow = 0;

  @Input('doctors')
  doctors: any[] = [];

  @Input('menu')
  rowMenu: { label: string, icon: string }[] = [
    { label: 'View', icon: 'pi pi-eye' },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Delete', icon: 'pi pi-times' }
  ];

  doctorRowMenu: MenuItem[] = [];

  constructor() { }

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

}
