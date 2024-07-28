import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvpsPopoverComponent } from './rsvps-popover.component';

describe('RsvpsPopoverComponent', () => {
  let component: RsvpsPopoverComponent;
  let fixture: ComponentFixture<RsvpsPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsvpsPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsvpsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
