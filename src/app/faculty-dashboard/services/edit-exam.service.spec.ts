import { TestBed, inject } from '@angular/core/testing';

import { EditExamService } from './edit-exam.service';

describe('EditExamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditExamService]
    });
  });

  it('should be created', inject([EditExamService], (service: EditExamService) => {
    expect(service).toBeTruthy();
  }));
});
