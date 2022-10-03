import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { patientStatusOptions, reportStatusOptions, treatmentOptions } from 'src/app/common/dropdown-options';
import { AuthService } from 'src/app/services/auth.service';
import { PatientService } from 'src/app/services/patient.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  isLoadingReports: boolean = false;
  dialog = {
    show: false,
    heading: '',
    loading: false,
    readonly: true,
    mode: 'N'
  };
  activeRow: number = 0;

  rowMenu: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye', command: () => { this.viewReport(); } }
  ];

  reports: any[] = [];

  patientList: any[] = [];

  treatmentOptions = treatmentOptions;

  statusOptions = reportStatusOptions;

  patientStatusOptions = patientStatusOptions;

  reportForm: FormGroup = new FormGroup({
    patientId: new FormControl(null, [Validators.required, Validators.min(0)]),
    dateAdmitted: new FormControl('', [Validators.required]),
    dateDischarged: new FormControl('', [Validators.required]),
    treatmentType: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    status: new FormControl('', [Validators.required]),
    patientStatus: new FormControl('', [Validators.required]),
  });

  constructor(
    public authService: AuthService,
    private reportService: ReportService, 
    private messageService: MessageService,
    private patientService: PatientService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.fetchReports();
    this.fetchPatients();
    if(this.authService.userType === 'A') {
      this.rowMenu.push(
        { label: 'Remove', icon: 'pi pi-trash', command: () => { this.onDelete(); } }
      );
    }
    else if(this.authService.userType === 'D') {
      this.rowMenu.push(
        { label: 'Edit', icon: 'pi pi-cog', command: () => { this.editReport(); } },
      );
    }
  }

  openMenu(rowIndex: number) {
    this.activeRow = rowIndex;
  }

  fetchReports() {
    let allReports;
    if (this.authService.userType === 'A') {
      allReports = this.reportService.getAllReports()
    } else if (this.authService.userType === 'D') {
      allReports = this.reportService.getReportsByDoctorId(this.authService.roleSubject.value.id);
    } else {
      allReports = this.reportService.getReportsByPatientId(this.authService.roleSubject.value.id);
    }
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

  fetchPatients() {
    this.patientService.getAllPatients().subscribe({
      next: (result) => {
        this.patientList.splice(0, this.reports.length, ...<any[]>result);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
        this.reports.splice(0, this.reports.length);
      }
    });
  }

  openReportForm() {
    this.reportForm.reset();
    this.dialog.heading = 'Add Report';
    this.dialog.readonly = false;
    this.dialog.show = true;
  }

  onSubmit() {
    if(this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }
    let api, summary = '', detail = 'Your patient will be notified of the report!';
    
    if(this.dialog.mode === 'N') {
      api = this.reportService.addReport(this.reportForm.value);
      summary = 'Report created';
    } else {
      let data = { ...this.reportForm.getRawValue() };
      delete data.patientId;
      delete data.dateAdmitted;
      api = this.reportService.updateReport(this.reports[this.activeRow].id, data);
      summary = 'Report updated';
    }
    this.dialog.loading = true;
    api.subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary,
          detail
        });
        this.reportForm.reset();
        this.dialog.loading = false;
        this.dialog.show = false;
        this.fetchReports();
        console.log(result);
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Something went wrong'
        });
        this.dialog.loading = false;
      }
    });
  }

  viewReport() {
    this.dialog.heading = 'Report Details';
    this.dialog.readonly = true;
    this.reportForm.patchValue(this.reports[this.activeRow]);
    this.dialog.show = true;
  }

  editReport() {
    this.dialog.heading = 'Edit Report';
    this.dialog.readonly = false;
    this.dialog.mode = 'E';
    this.reportForm.patchValue(this.reports[this.activeRow]);
    this.reportForm.patchValue({
      dateAdmitted: new Date(this.reports[this.activeRow].dateAdmitted)
    });
    if(this.reports[this.activeRow].dateDischarged) {
      this.reportForm.patchValue({
        dateDischarged: new Date(this.reports[this.activeRow].dateDischarged)
      });
    }
    this.dialog.show = true;
  }

  onDelete() {
    this.confirmationService.confirm({
      acceptButtonStyleClass: 'p-button-danger',
      message: `Do you want to delete this report?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.reportService.deleteReport(this.reports[this.activeRow].id).subscribe({
          next: (reponse: any) => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Report deleted' });
            this.fetchReports();
          },
          error: (err: any) => {
            console.log(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
          }
        });
      },
      reject: (type: ConfirmEventType) => { }
    });
  }
}
