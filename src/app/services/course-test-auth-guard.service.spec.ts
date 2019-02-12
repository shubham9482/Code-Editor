import { TestBed, inject } from '@angular/core/testing';

import { CourseTestAuthGuardService } from './course-test-auth-guard.service';

describe('CourseTestAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseTestAuthGuardService]
    });
  });

  it('should be created', inject([CourseTestAuthGuardService], (service: CourseTestAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
