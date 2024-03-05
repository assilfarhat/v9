import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAffilComponent } from './edit-affil.component';

describe('EditAffilComponent', () => {
  let component: EditAffilComponent;
  let fixture: ComponentFixture<EditAffilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAffilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAffilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
