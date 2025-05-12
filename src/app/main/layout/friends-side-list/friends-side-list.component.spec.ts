import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsSideListComponent } from './friends-side-list.component';

describe('OnlineListComponent', () => {
  let component: FriendsSideListComponent;
  let fixture: ComponentFixture<FriendsSideListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendsSideListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsSideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
