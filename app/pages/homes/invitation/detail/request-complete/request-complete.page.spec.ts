import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCompletePage } from './request-complete.page';

describe('RequestCompletePage', () => {
  let component: RequestCompletePage;
  let fixture: ComponentFixture<RequestCompletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCompletePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
