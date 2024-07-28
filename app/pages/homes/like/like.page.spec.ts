import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikePage } from './like.page';

describe('LikePage', () => {
  let component: LikePage;
  let fixture: ComponentFixture<LikePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
