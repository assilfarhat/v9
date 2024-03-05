import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeClientComponent } from './recharge-client.component';

describe('RechargeClientComponent', () => {
  let component: RechargeClientComponent;
  let fixture: ComponentFixture<RechargeClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
