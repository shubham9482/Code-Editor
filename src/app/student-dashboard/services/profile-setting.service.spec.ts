import { TestBed, inject } from '@angular/core/testing';

import { ProfileSettingService } from './profile-setting.service';

describe('ProfileSettingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileSettingService]
    });
  });

  it('should be created', inject([ProfileSettingService], (service: ProfileSettingService) => {
    expect(service).toBeTruthy();
  }));
});
