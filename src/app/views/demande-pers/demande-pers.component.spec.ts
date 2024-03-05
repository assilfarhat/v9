import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandePersComponent } from './demande-pers.component';

describe('DemandePersComponent', () => {
  let component: DemandePersComponent;
  let fixture: ComponentFixture<DemandePersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandePersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandePersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
