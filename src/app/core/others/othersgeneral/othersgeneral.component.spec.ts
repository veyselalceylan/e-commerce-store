import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersgeneralComponent } from './othersgeneral.component';

describe('OthersgeneralComponent', () => {
  let component: OthersgeneralComponent;
  let fixture: ComponentFixture<OthersgeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OthersgeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OthersgeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
