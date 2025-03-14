import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomanmusicComponent } from './womanmusic.component';

describe('WomanmusicComponent', () => {
  let component: WomanmusicComponent;
  let fixture: ComponentFixture<WomanmusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WomanmusicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WomanmusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
