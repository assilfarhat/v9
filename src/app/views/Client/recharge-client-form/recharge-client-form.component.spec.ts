import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeClientFormComponent } from './recharge-client-form.component';

describe('RechargeClientFormComponent', () => {
  let component: RechargeClientFormComponent;
  let fixture: ComponentFixture<RechargeClientFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeClientFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
