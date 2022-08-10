import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AppointmentComponent } from './dashboard/appointment/appointment.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientRecordComponent } from './dashboard/patient-record/patient-record.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: AuthComponent },
  { 
    path: 'dashboard', component: DashboardComponent,
    children: [
      // General
      { path: '', component: DashboardHomeComponent, pathMatch: 'full' },
      // Patient
      { path: 'myrecord', component: PatientRecordComponent },
      { path: 'appointment', component: AppointmentComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
