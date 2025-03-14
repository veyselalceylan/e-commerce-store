import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomansportComponent } from './womansport.component';

describe('WomansportComponent', () => {
  let component: WomansportComponent;
  let fixture: ComponentFixture<WomansportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WomansportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WomansportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
