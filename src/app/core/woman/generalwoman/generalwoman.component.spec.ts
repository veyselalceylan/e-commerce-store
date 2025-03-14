import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralwomanComponent } from './generalwoman.component';

describe('GeneralwomanComponent', () => {
  let component: GeneralwomanComponent;
  let fixture: ComponentFixture<GeneralwomanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralwomanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralwomanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
