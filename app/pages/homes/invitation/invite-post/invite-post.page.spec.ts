import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitePostPage } from './invite-post.page';

describe('InvitePostPage', () => {
  let component: InvitePostPage;
  let fixture: ComponentFixture<InvitePostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitePostPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitePostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
