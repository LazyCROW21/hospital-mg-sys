import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  isDoctor: boolean = false;
  isPatient: boolean = false;
  isAdmin: boolean = true;
  holderId: number = 1;
  isLoadingReports: boolean = false;
  loadingIcon: string = '';
  showNewReportForm: boolean = false;
  activeRow: number = 0;
  rowMenu: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye' },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Remove', icon: 'pi pi-trash' },
  ];
  reports: any[] = [];

  patientList: { label: string, value: number }[] = [
    { label: 'Patient 1', value: 1 },
    { label: 'Patient 2', value: 2 },
    { label: 'Patient 3', value: 3 }
  ];

  treatmentOptions: { label: string, value: string }[] = [
    { label: 'Surgory', value: 'Surgory' },
    { label: 'Aeromatherapy', value: 'Aeromatherapy' },
    { label: 'Vaccine', value: 'Vaccine' }
  ];

  statusOptions: { label: string, value: string }[] = [
    { label: 'success', value: 'success' },
    { label: 'fail', value: 'fail' },
    { label: 'incomplete', value: 'incomplete' },
  ];

  patientStatusOptions: { label: string, value: string }[] = [
    { label: 'unchanged', value: 'unchanged' },
    { label: 'improved', value: 'improved' },
    { label: 'cured', value: 'cured' },
    { label: 'worsen', value: 'worsen' },
  ];

  newReportForm: FormGroup = new FormGroup({
    patientId: new FormControl(null, [Validators.required, Validators.min(0)]),
    dateAdmitted: new FormControl('', [Validators.required]),
    dateDischarged: new FormControl('', [Validators.required]),
    treatmentType: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    status: new FormControl('', [Validators.required]),
    patientStatus: new FormControl('', [Validators.required]),
  });

  constructor(private reportService: ReportService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.fetchReports();
  }

  openMenu(rowIndex: number) {
    this.activeRow = rowIndex;
  }

  fetchReports() {
    let allReports;
    if (this.isAdmin) {
      allReports = this.reportService.getAllReports()
    } else if (this.isDoctor) {
      allReports = this.reportService.getReportsByDoctorId(this.holderId);
    } else {
      allReports = this.reportService.getReportsByPatientId(this.holderId);
    }
    this.isLoadingReports = true;
    this.isLoadingReports = true;
    allReports.subscribe({
      next: (result) => {
        console.log(result);
        this.reports.splice(0, this.reports.length, ...<any[]>result);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
        this.reports.splice(0, this.reports.length);
        this.isLoadingReports = false;
      },
      complete: () => {
        this.isLoadingReports = false;
      }
    });
  }

  openReportForm() {
    this.showNewReportForm = true;
  }

  onSubmit() {
    this.loadingIcon = 'pi pi-spin pi-spinner';
    this.reportService.addReport(this.newReportForm.value).subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Report created',
          detail: 'Your patient will be notified of the report!'
        });
        console.log(result);
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Something went wrong'
        });
        this.loadingIcon = '';
      },
      complete: () => {
        this.newReportForm.reset();
        this.loadingIcon = '';
        this.showNewReportForm = false;
        this.fetchReports();
      }
    });
  }

}
