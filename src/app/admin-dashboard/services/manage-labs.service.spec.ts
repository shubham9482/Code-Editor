import { TestBed, inject } from '@angular/core/testing';

import { ManageLabsService } from './manage-labs.service';

describe('ManageLabsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageLabsService]
    });
  });

  it('should be created', inject([ManageLabsService], (service: ManageLabsService) => {
    expect(service).toBeTruthy();
  }));
});
