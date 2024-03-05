import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCreditComponent } from './note-credit.component';

describe('NoteCreditComponent', () => {
  let component: NoteCreditComponent;
  let fixture: ComponentFixture<NoteCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
