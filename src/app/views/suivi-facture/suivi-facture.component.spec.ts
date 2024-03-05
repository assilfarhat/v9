import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviFactureComponent } from './suivi-facture.component';

describe('SuiviFactureComponent', () => {
  let component: SuiviFactureComponent;
  let fixture: ComponentFixture<SuiviFactureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviFactureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
