import { Component } from '@angular/core';
import { LayoutHeaderComponent } from './layout-header/layout-header.component';
import { LayoutSideNavComponent } from './layout-side-nav/layout-side-nav.component';

@Component({
  selector: 'app-layout',
  imports: [LayoutHeaderComponent, LayoutSideNavComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {}
