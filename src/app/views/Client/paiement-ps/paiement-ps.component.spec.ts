import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementPSComponent } from './paiement-ps.component';

describe('PaiementPSComponent', () => {
  let component: PaiementPSComponent;
  let fixture: ComponentFixture<PaiementPSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaiementPSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaiementPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
