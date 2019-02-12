import { TestBed, inject } from '@angular/core/testing';

import { EditUserService } from './edit-user.service';

describe('EditUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditUserService]
    });
  });

  it('should be created', inject([EditUserService], (service: EditUserService) => {
    expect(service).toBeTruthy();
  }));
});
