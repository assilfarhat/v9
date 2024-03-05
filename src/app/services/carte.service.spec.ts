import { TestBed } from '@angular/core/testing';

import { CarteService } from './carte.service';

describe('CarteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarteService = TestBed.get(CarteService);
    expect(service).toBeTruthy();
  });
});
