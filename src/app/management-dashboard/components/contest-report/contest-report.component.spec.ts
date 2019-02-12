import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestReportComponent } from './contest-report.component';

describe('ContestReportComponent', () => {
  let component: ContestReportComponent;
  let fixture: ComponentFixture<ContestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
