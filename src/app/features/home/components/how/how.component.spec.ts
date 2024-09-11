import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowComponent } from './how.component';

describe('HowComponent', () => {
  let component: HowComponent;
  let fixture: ComponentFixture<HowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HowComponent]
    });
    fixture = TestBed.createComponent(HowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
