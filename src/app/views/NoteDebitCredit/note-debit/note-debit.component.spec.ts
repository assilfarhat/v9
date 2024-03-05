import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDebitComponent } from './note-debit.component';

describe('NoteDebitComponent', () => {
  let component: NoteDebitComponent;
  let fixture: ComponentFixture<NoteDebitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteDebitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
