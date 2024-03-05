import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAffilComponent } from './add-affil.component';

describe('AddAffilComponent', () => {
  let component: AddAffilComponent;
  let fixture: ComponentFixture<AddAffilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAffilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAffilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
