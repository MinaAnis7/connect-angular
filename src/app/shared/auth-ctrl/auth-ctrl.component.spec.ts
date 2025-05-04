import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCtrlComponent } from './auth-ctrl.component';

describe('AuthCtrlComponent', () => {
  let component: AuthCtrlComponent;
  let fixture: ComponentFixture<AuthCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCtrlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
