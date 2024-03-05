import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartitionPlafondComponent } from './repartition-plafond.component';

describe('RepartitionPlafondComponent', () => {
  let component: RepartitionPlafondComponent;
  let fixture: ComponentFixture<RepartitionPlafondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepartitionPlafondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepartitionPlafondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
