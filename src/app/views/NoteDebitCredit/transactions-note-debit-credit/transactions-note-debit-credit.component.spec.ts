import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsNoteDebitCreditComponent } from './transactions-note-debit-credit.component';

describe('TransactionsNoteDebitCreditComponent', () => {
  let component: TransactionsNoteDebitCreditComponent;
  let fixture: ComponentFixture<TransactionsNoteDebitCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsNoteDebitCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsNoteDebitCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
