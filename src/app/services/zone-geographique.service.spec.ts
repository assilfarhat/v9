import { TestBed } from '@angular/core/testing';

import { ZoneGeographiqueService } from './zone-geographique.service';

describe('ZoneGeographiqueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ZoneGeographiqueService = TestBed.get(ZoneGeographiqueService);
    expect(service).toBeTruthy();
  });
});
