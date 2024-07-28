import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCompletePage } from './post-complete.page';

describe('PostCompletePage', () => {
  let component: PostCompletePage;
  let fixture: ComponentFixture<PostCompletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostCompletePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
