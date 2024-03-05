import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAffilComponent } from './list-affil.component';

describe('ListAffilComponent', () => {
  let component: ListAffilComponent;
  let fixture: ComponentFixture<ListAffilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAffilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAffilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
