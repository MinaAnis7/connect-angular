import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSideNavComponent } from './layout-side-nav.component';

describe('LayoutSideNavComponent', () => {
  let component: LayoutSideNavComponent;
  let fixture: ComponentFixture<LayoutSideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutSideNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
