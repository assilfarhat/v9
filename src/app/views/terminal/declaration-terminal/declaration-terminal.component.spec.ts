import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationTerminalComponent } from './declaration-terminal.component';

describe('DeclarationTerminalComponent', () => {
  let component: DeclarationTerminalComponent;
  let fixture: ComponentFixture<DeclarationTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclarationTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclarationTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
