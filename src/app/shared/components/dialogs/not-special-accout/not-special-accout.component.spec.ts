import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotSpecialAccoutComponent } from './not-special-accout.component';

describe('NotSpecialAccoutComponent', () => {
  let component: NotSpecialAccoutComponent;
  let fixture: ComponentFixture<NotSpecialAccoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotSpecialAccoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotSpecialAccoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
