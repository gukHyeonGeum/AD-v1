import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneModifyComponent } from './phone-modify.component';

describe('PhoneModifyComponent', () => {
  let component: PhoneModifyComponent;
  let fixture: ComponentFixture<PhoneModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
