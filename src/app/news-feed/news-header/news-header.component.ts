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
} from '@fortawesome/free-regular-svg-icons';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

declare var bootstrap: any;

@Component({
  selector: 'app-news-header',
  imports: [LogoComponent, FontAwesomeModule],
  templateUrl: './news-header.component.html',
  styleUrl: './news-header.component.css',
})
export class NewsHeaderComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(faBell, faCommentDots, faUser, faMagnifyingGlass);
  }
}
