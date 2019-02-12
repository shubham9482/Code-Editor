import { TestBed, inject } from '@angular/core/testing';

import { EditLabsService } from './edit-labs.service';

describe('EditLabsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditLabsService]
    });
  });

  it('should be created', inject([EditLabsService], (service: EditLabsService) => {
    expect(service).toBeTruthy();
  }));
});
