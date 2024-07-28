import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BugsPage } from './bugs.page';

describe('BugsPage', () => {
  let component: BugsPage;
  let fixture: ComponentFixture<BugsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BugsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BugsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
