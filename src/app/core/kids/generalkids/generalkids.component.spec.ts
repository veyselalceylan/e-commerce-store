import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralkidsComponent } from './generalkids.component';

describe('GeneralkidsComponent', () => {
  let component: GeneralkidsComponent;
  let fixture: ComponentFixture<GeneralkidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralkidsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralkidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
