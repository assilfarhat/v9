import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviRechargeComponent } from './suivi-recharge.component';

describe('SuiviRechargeComponent', () => {
  let component: SuiviRechargeComponent;
  let fixture: ComponentFixture<SuiviRechargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviRechargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
