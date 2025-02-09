import { TestBed } from '@angular/core/testing';

import { GlobeQuizService } from './globe-quiz.service';

describe('GlobeQuizService', () => {
  let service: GlobeQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobeQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
