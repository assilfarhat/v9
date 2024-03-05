import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldeDepartComponent } from './solde-depart.component';

describe('SoldeDepartComponent', () => {
  let component: SoldeDepartComponent;
  let fixture: ComponentFixture<SoldeDepartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoldeDepartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldeDepartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
