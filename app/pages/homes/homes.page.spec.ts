import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomesPage } from './homes.page';

describe('HomesPage', () => {
  let component: HomesPage;
  let fixture: ComponentFixture<HomesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
