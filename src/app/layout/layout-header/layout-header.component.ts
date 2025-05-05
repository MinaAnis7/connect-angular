import { Component } from '@angular/core';
import { LogoComponent } from '../../shared/logo/logo.component';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faBell,
  faCommentDots,
  faUser,
  faUserCircle,
} from '@fortawesome/free-regular-svg-icons';

import {
  faMagnifyingGlass,
  faSliders,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout-header',
  imports: [LogoComponent, FontAwesomeModule, NgbDropdownModule, MatIconModule],
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.css',
})
export class LayoutHeaderComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faBell,
      faCommentDots,
      faUser,
      faMagnifyingGlass,
      faUserCircle,
      faSliders,
      faArrowRightFromBracket
    );
  }
}
