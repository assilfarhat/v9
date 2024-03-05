import { TestBed } from '@angular/core/testing';

import { RechargeClientService } from './recharge-client.service';

describe('RechargeClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RechargeClientService = TestBed.get(RechargeClientService);
    expect(service).toBeTruthy();
  });
});
