import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteSettingsComponent } from './carte-settings.component';

describe('CarteSettingsComponent', () => {
  let component: CarteSettingsComponent;
  let fixture: ComponentFixture<CarteSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
