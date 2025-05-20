import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSelectedChatComponent } from './no-selected-chat.component';

describe('NoSelectedChatComponent', () => {
  let component: NoSelectedChatComponent;
  let fixture: ComponentFixture<NoSelectedChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoSelectedChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoSelectedChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
