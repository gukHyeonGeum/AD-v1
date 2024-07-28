import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostReviewPage } from './post-review.page';

describe('PostReviewPage', () => {
  let component: PostReviewPage;
  let fixture: ComponentFixture<PostReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostReviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
