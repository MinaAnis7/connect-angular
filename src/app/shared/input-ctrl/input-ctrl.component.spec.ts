import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCtrlComponent } from './input-ctrl.component';

describe('InputCtrlComponent', () => {
  let component: InputCtrlComponent;
  let fixture: ComponentFixture<InputCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCtrlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
