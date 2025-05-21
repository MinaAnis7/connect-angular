import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionsDialogComponent } from './connections-dialog.component';

describe('ConnectionsDialogComponent', () => {
  let component: ConnectionsDialogComponent;
  let fixture: ComponentFixture<ConnectionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
