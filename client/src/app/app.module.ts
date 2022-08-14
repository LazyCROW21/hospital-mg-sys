import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { CarouselModule } from 'primeng/carousel';
import { FieldsetModule } from 'primeng/fieldset';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { PatientRecordComponent } from './dashboard/patient-record/patient-record.component';
import { AppointmentComponent } from './dashboard/appointment/appointment.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { MainComponent } from './home/main/main.component';
import { FacilityComponent } from './home/facility/facility.component';
import { AboutComponent } from './home/about/about.component';
import { ContactusComponent } from './home/contactus/contactus.component';
import { DepartmentsComponent } from './dashboard/departments/departments.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DoctorCasesComponent } from './dashboard/doctor-cases/doctor-cases.component';
import { DepartmentComponent } from './dashboard/departments/department/department.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    AuthComponent,
    DashboardHomeComponent,
    PatientRecordComponent,
    AppointmentComponent,
    ProfileComponent,
    MainComponent,
    FacilityComponent,
    AboutComponent,
    ContactusComponent,
    DepartmentsComponent,
    PageNotFoundComponent,
    DoctorCasesComponent,
    DepartmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TabViewModule,
    DividerModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    MenuModule,
    SidebarModule,
    PanelMenuModule,
    InputNumberModule,
    TableModule,
    CarouselModule,
    FieldsetModule,
    AccordionModule,
    ToastModule,
    HttpClientModule,
    ProgressBarModule,
    InputTextareaModule
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
