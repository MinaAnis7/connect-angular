import { Component } from '@angular/core';
import { LayoutSideNavComponent } from './layout-side-nav/layout-side-nav.component';
import { FriendsSideListComponent } from './friends-side-list/friends-side-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [LayoutSideNavComponent, FriendsSideListComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {}
