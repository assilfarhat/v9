import { TestBed } from '@angular/core/testing';

import { DemandePersService } from './demande-pers.service';

describe('DemandePersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DemandePersService = TestBed.get(DemandePersService);
    expect(service).toBeTruthy();
  });
});
