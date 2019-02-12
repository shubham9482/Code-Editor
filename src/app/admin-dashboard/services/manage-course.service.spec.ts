import { TestBed, inject } from '@angular/core/testing';

import { ManageCourseService } from './manage-course.service';

describe('ManageCourseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageCourseService]
    });
  });

  it('should be created', inject([ManageCourseService], (service: ManageCourseService) => {
    expect(service).toBeTruthy();
  }));
});
