import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDebitCreditComponent } from './note-debit-credit.component';

describe('NoteDebitCreditComponent', () => {
  let component: NoteDebitCreditComponent;
  let fixture: ComponentFixture<NoteDebitCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteDebitCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteDebitCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
