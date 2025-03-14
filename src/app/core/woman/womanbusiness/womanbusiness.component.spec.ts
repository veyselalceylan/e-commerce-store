import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomanbusinessComponent } from './womanbusiness.component';

describe('WomanbusinessComponent', () => {
  let component: WomanbusinessComponent;
  let fixture: ComponentFixture<WomanbusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WomanbusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WomanbusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
