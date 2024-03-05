import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTerminalComponent } from './list-terminal.component';

describe('ListTerminalComponent', () => {
  let component: ListTerminalComponent;
  let fixture: ComponentFixture<ListTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
