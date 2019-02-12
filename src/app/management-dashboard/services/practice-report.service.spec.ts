import { TestBed, inject } from '@angular/core/testing';

import { PracticeReportService } from './practice-report.service';

describe('PracticeReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PracticeReportService]
    });
  });

  it('should be created', inject([PracticeReportService], (service: PracticeReportService) => {
    expect(service).toBeTruthy();
  }));
});
