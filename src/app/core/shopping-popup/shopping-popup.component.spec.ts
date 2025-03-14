import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingPopupComponent } from './shopping-popup.component';

describe('ShoppingPopupComponent', () => {
  let component: ShoppingPopupComponent;
  let fixture: ComponentFixture<ShoppingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
