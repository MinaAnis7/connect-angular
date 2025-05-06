import { Component } from '@angular/core';
import { LayoutHeaderComponent } from './layout-header/layout-header.component';
import { LayoutSideNavComponent } from './layout-side-nav/layout-side-nav.component';
import { FriendsSideListComponent } from './friends-side-list/friends-side-list.component';

@Component({
  selector: 'app-layout',
  imports: [
    LayoutHeaderComponent,
    LayoutSideNavComponent,
    FriendsSideListComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {}
