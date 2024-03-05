import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviTransactionComponent } from './suivi-transaction.component';

describe('SuiviTransactionComponent', () => {
  let component: SuiviTransactionComponent;
  let fixture: ComponentFixture<SuiviTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
