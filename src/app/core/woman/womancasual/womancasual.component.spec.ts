import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomancasualComponent } from './womancasual.component';

describe('WomancasualComponent', () => {
  let component: WomancasualComponent;
  let fixture: ComponentFixture<WomancasualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WomancasualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WomancasualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
