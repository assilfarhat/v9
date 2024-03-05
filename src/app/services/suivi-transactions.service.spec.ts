import { TestBed } from '@angular/core/testing';

import { SuiviTransactionsService } from './suivi-transactions.service';

describe('SuiviTransactionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuiviTransactionsService = TestBed.get(SuiviTransactionsService);
    expect(service).toBeTruthy();
  });
});
