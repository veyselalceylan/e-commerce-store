import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoversComponent } from './lovers.component';

describe('LoversComponent', () => {
  let component: LoversComponent;
  let fixture: ComponentFixture<LoversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoversComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
