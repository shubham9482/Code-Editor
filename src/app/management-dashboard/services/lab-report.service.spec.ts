import { TestBed, inject } from '@angular/core/testing';

import { LabReportService } from './lab-report.service';

describe('LabReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LabReportService]
    });
  });

  it('should be created', inject([LabReportService], (service: LabReportService) => {
    expect(service).toBeTruthy();
  }));
});
