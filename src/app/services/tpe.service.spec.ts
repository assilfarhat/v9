import { TestBed } from '@angular/core/testing';

import { TpeService } from './tpe.service';

describe('TpeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TpeService = TestBed.get(TpeService);
    expect(service).toBeTruthy();
  });
});
