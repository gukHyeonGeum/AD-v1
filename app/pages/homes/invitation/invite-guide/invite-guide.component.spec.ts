import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteGuideComponent } from './invite-guide.component';

describe('InviteGuideComponent', () => {
  let component: InviteGuideComponent;
  let fixture: ComponentFixture<InviteGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
