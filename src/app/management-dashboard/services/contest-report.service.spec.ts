import { TestBed, inject } from '@angular/core/testing';

import { ContestReportService } from './contest-report.service';

describe('ContestReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContestReportService]
    });
  });

  it('should be created', inject([ContestReportService], (service: ContestReportService) => {
    expect(service).toBeTruthy();
  }));
});
