import { TestBed, inject } from '@angular/core/testing';

import { CourseReportService } from './course-report.service';

describe('CourseReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseReportService]
    });
  });

  it('should be created', inject([CourseReportService], (service: CourseReportService) => {
    expect(service).toBeTruthy();
  }));
});
