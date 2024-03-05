import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlafondPSComponent } from './edit-plafond-ps.component';

describe('EditPlafondPSComponent', () => {
  let component: EditPlafondPSComponent;
  let fixture: ComponentFixture<EditPlafondPSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPlafondPSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlafondPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
