import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyComponent } from './baby.component';

describe('BabyComponent', () => {
  let component: BabyComponent;
  let fixture: ComponentFixture<BabyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BabyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BabyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
