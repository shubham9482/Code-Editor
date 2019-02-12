import { TestBed, inject } from '@angular/core/testing';

import { ManagementAuthGuardService } from './management-auth-guard.service';

describe('ManagementAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManagementAuthGuardService]
    });
  });

  it('should be created', inject([ManagementAuthGuardService], (service: ManagementAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
