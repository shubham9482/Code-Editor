import { TestBed, inject } from '@angular/core/testing';

import { StudentReportService } from './student-report.service';

describe('StudentReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentReportService]
    });
  });

  it('should be created', inject([StudentReportService], (service: StudentReportService) => {
    expect(service).toBeTruthy();
  }));
});
