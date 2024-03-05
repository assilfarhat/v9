import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviFichiersComponent } from './suivi-fichiers.component';

describe('SuiviFichiersComponent', () => {
  let component: SuiviFichiersComponent;
  let fixture: ComponentFixture<SuiviFichiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviFichiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviFichiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
