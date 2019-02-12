import { TestBed, inject } from '@angular/core/testing';

import { CreateExamService } from './create-exam.service';

describe('CreateExamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateExamService]
    });
  });

  it('should be created', inject([CreateExamService], (service: CreateExamService) => {
    expect(service).toBeTruthy();
  }));
});
