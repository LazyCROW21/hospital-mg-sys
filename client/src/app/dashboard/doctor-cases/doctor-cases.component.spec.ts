import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCasesComponent } from './doctor-cases.component';

describe('DoctorCasesComponent', () => {
  let component: DoctorCasesComponent;
  let fixture: ComponentFixture<DoctorCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorCasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
