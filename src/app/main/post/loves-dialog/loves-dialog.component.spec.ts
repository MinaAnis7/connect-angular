import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LovesDialogComponent } from './loves-dialog.component';

describe('LovesDialogComponent', () => {
  let component: LovesDialogComponent;
  let fixture: ComponentFixture<LovesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LovesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LovesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
