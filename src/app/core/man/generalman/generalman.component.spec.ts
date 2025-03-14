import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralmanComponent } from './generalman.component';

describe('GeneralmanComponent', () => {
  let component: GeneralmanComponent;
  let fixture: ComponentFixture<GeneralmanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralmanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
