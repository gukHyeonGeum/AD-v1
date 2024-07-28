import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMountPage } from './search-mount.page';

describe('SearchMountPage', () => {
  let component: SearchMountPage;
  let fixture: ComponentFixture<SearchMountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
