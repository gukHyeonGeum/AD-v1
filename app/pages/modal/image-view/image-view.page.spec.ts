import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewPage } from './image-view.page';

describe('ImageViewPage', () => {
  let component: ImageViewPage;
  let fixture: ComponentFixture<ImageViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
