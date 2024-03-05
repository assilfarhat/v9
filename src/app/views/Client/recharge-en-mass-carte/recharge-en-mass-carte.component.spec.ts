import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeEnMassCarteComponent } from './recharge-en-mass-carte.component';

describe('RechargeEnMassCarteComponent', () => {
  let component: RechargeEnMassCarteComponent;
  let fixture: ComponentFixture<RechargeEnMassCarteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeEnMassCarteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeEnMassCarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
