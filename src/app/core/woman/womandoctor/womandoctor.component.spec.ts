import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomandoctorComponent } from './womandoctor.component';

describe('WomandoctorComponent', () => {
  let component: WomandoctorComponent;
  let fixture: ComponentFixture<WomandoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WomandoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WomandoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
