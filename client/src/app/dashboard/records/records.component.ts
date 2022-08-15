import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { RecordService } from 'src/app/services/record.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  isDoctor: boolean = false;
  isPatient: boolean = false;
  isAdmin: boolean = true;
  holderId: number = 1;
  isLoadingRecords: boolean = false;
  loadingIcon: string = '';
  showNewRecordForm: boolean = false;
  activeRow: number = 0;
  rowMenu: MenuItem[] = [
    { label: 'View', icon: 'pi pi-eye' },
    { label: 'Edit', icon: 'pi pi-cog' },
    { label: 'Remove', icon: 'pi pi-trash' },
  ];
  records: any[] = [
    { id: 2, name: 'Brain Cancer', parent: 'Cancer' },
    { id: 1, name: 'Liver Cancer', parent: 'Cancer' }
  ];

  newDepartmentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    parentDepartmentId: new FormControl(null)
  });

  constructor(private recordService: RecordService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.fetchRecords();
  }

  openMenu(rowIndex: number) {
    this.activeRow = rowIndex;
  }

  fetchRecords () {
    let allRecords;
    if(this.isAdmin) {
      allRecords = this.recordService.getAllRecords()
    } else if(this.isDoctor) {
      allRecords = this.recordService.getRecordsByDoctorId(this.holderId);
    } else {
      allRecords = this.recordService.getRecordsByPatientId(this.holderId);
    }
    this.isLoadingRecords = true;
    this.isLoadingRecords = true;
    allRecords.subscribe({
      next: (result) => {
        console.log(result);
        this.records.splice(0, this.records.length, ...<any[]>result);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Cannot fetch Data'
        });
        console.error(error);
        this.records.splice(0, this.records.length);
        this.isLoadingRecords = false;
      },
      complete: () => {
        this.isLoadingRecords = false;
      }
    });
  }
  
  openRecordForm() {
    this.showNewRecordForm = true;
  }

  onSubmit() {
    this.loadingIcon = 'pi pi-spin pi-spinner';
    this.recordService.addRecord(this.newDepartmentForm.value).subscribe({
      next: (result: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Record created',
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
        this.newDepartmentForm.reset();
        this.loadingIcon = '';
        this.showNewRecordForm = false;
        this.fetchRecords();
      }
    });
  }

}
