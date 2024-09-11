import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvantagesComponent } from './advantages.component';

describe('AdvantagesComponent', () => {
  let component: AdvantagesComponent;
  let fixture: ComponentFixture<AdvantagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvantagesComponent]
    });
    fixture = TestBed.createComponent(AdvantagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
