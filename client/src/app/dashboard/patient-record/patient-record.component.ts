import { Component, OnInit } from '@angular/core';

import { Record } from '../../common/types/record';

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styleUrls: ['./patient-record.component.css']
})
export class PatientRecordComponent implements OnInit {
  first = 0;
  rows = 10;
  recordCols:{ field: string, label: string }[];
  records: Record[] = [
    {
      id: 101,
      patientId: 1,
      doctorId: 2,
      description: 'asdadaasd',
      status: 'success',
      patientStatus: 'recovered',
      treatmentType: 'Surgory',
      dateAdmitted: new Date(),
      dateDischarged: new Date()
    }
  ]

  constructor() {
    this.recordCols = [
      { field: 'id', label: 'ID' },
      { label: 'Patient ID', field: 'patientId' },
      { label: 'Doctor ID', field: 'doctorId' },
      { label: 'Date Admit', field: 'dateAdmitted' },
      { label: 'Date Discharge', field: 'dateDischarged' },
      { label: 'Treatment Type', field: 'treatmentType' },
      { label: 'Description', field: 'description' },
      { label: 'Status', field: 'status' },
      { label: 'Patient Status', field: 'patientStatus' },
  ];
  
  }

  ngOnInit(): void {
  }

}
