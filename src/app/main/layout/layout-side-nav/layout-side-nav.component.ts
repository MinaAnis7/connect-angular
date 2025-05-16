import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-layout-side-nav',
  imports: [MatIconModule, FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './layout-side-nav.component.html',
  styleUrl: './layout-side-nav.component.css',
})
export class LayoutSideNavComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(faNewspaper);
  }
}
