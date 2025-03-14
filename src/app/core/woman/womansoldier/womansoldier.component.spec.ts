import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomansoldierComponent } from './womansoldier.component';

describe('WomansoldierComponent', () => {
  let component: WomansoldierComponent;
  let fixture: ComponentFixture<WomansoldierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WomansoldierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WomansoldierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
