import { TestBed } from '@angular/core/testing';

import { BonFilesService } from './bon-files.service';

describe('BonFilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BonFilesService = TestBed.get(BonFilesService);
    expect(service).toBeTruthy();
  });
});
