import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTpeComponent } from './add-tpe.component';

describe('AddTpeComponent', () => {
  let component: AddTpeComponent;
  let fixture: ComponentFixture<AddTpeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTpeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
