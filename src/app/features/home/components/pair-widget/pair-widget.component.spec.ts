import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PairWidgetComponent } from './pair-widget.component';

describe('PairWidgetComponent', () => {
  let component: PairWidgetComponent;
  let fixture: ComponentFixture<PairWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PairWidgetComponent]
    });
    fixture = TestBed.createComponent(PairWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
