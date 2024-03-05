import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueRechargeTransfertCarteComponent } from './historique-recharge-transfert-carte.component';

describe('HistoriqueRechargeTransfertCarteComponent', () => {
  let component: HistoriqueRechargeTransfertCarteComponent;
  let fixture: ComponentFixture<HistoriqueRechargeTransfertCarteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriqueRechargeTransfertCarteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueRechargeTransfertCarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
