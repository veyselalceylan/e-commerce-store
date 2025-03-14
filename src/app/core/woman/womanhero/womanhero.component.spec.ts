import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomanheroComponent } from './womanhero.component';

describe('WomanheroComponent', () => {
  let component: WomanheroComponent;
  let fixture: ComponentFixture<WomanheroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WomanheroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WomanheroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
