import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/common/types/appointment';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointmentCols: { field: string; label: string; }[] = [
    { field: 'id', label: 'ID' },
    { field: 'patientId', label: 'Patien ID' },
    { field: 'doctorId', label: 'Doctor ID' },
    { field: 'subject', label: 'Subject' },
    { field: 'message', label: 'Message' },
    { field: 'preferredDateTime', label: 'Preferred Date' },
    { field: 'status', label: 'Status' }
  ];
  appointments: Appointment[] = [
    {
      id: 1,
      patientId: 2,
      doctorId: 1,
      subject: 'AAQ',
      message: 'ASDADQQQEQ QWEQ WeQE QW EQWE',
      preferredDateTime: new Date(),
      status: 'fixed'
    }
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
