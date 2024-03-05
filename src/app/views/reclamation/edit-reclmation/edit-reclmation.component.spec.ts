import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReclmationComponent } from './edit-reclmation.component';

describe('EditReclmationComponent', () => {
  let component: EditReclmationComponent;
  let fixture: ComponentFixture<EditReclmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditReclmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReclmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
