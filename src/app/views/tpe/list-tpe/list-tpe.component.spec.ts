import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTpeComponent } from './list-tpe.component';

describe('ListTpeComponent', () => {
  let component: ListTpeComponent;
  let fixture: ComponentFixture<ListTpeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTpeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
