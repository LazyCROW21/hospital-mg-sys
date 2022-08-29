import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {
  activeRow = 0;

  @Input('patients')
  patients: any[] = [];

  @Input('menu')
  rowMenu: { label: string, icon: string }[] = [
    { label: 'View', icon: 'pi pi-eye' },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Delete', icon: 'pi pi-times' }
  ];

  patientRowMenu: MenuItem[] = [];

  constructor() { }

  @Output('onMenuAction') onMenuAction: EventEmitter<{
    event: string,
    data: any,
    index: number
  }> = new EventEmitter();

  ngOnInit(): void {
    this.rowMenu.forEach((menuItem) => {
      this.patientRowMenu.push({
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
      data: this.patients[this.activeRow],
      index: this.activeRow
    });
  }

}
