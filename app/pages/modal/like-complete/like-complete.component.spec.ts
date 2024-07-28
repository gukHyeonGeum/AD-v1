import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeCompleteComponent } from './like-complete.component';

describe('LikeCompleteComponent', () => {
  let component: LikeCompleteComponent;
  let fixture: ComponentFixture<LikeCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikeCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
