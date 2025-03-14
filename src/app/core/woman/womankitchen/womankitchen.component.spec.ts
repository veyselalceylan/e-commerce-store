import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomankitchenComponent } from './womankitchen.component';

describe('WomankitchenComponent', () => {
  let component: WomankitchenComponent;
  let fixture: ComponentFixture<WomankitchenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WomankitchenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WomankitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
