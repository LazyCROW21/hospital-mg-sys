import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranferDoctorDialogComponent } from './tranfer-doctor-dialog.component';

describe('TranferDoctorDialogComponent', () => {
  let component: TranferDoctorDialogComponent;
  let fixture: ComponentFixture<TranferDoctorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranferDoctorDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranferDoctorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
