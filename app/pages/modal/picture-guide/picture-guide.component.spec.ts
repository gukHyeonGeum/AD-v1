import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureGuideComponent } from './picture-guide.component';

describe('PictureGuideComponent', () => {
  let component: PictureGuideComponent;
  let fixture: ComponentFixture<PictureGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
