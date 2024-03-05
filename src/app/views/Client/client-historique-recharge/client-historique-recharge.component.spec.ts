import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHistoriqueRechargeComponent } from './client-historique-recharge.component';

describe('ClientHistoriqueRechargeComponent', () => {
  let component: ClientHistoriqueRechargeComponent;
  let fixture: ComponentFixture<ClientHistoriqueRechargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientHistoriqueRechargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientHistoriqueRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
