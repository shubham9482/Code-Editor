import { TestBed, inject } from '@angular/core/testing';

import { StudentAuthGuardService } from './student-auth-guard.service';

describe('StudentAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentAuthGuardService]
    });
  });

  it('should be created', inject([StudentAuthGuardService], (service: StudentAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
