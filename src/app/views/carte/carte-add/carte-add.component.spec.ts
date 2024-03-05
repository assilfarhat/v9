import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteAddComponent } from './carte-add.component';

describe('CarteAddComponent', () => {
  let component: CarteAddComponent;
  let fixture: ComponentFixture<CarteAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
