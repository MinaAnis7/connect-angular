import { Component } from '@angular/core';
import { InputCtrlComponent } from '../../shared/input-ctrl/input-ctrl.component';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-friends-side-list',
  imports: [InputCtrlComponent, FontAwesomeModule],
  templateUrl: './friends-side-list.component.html',
  styleUrl: './friends-side-list.component.css',
})
export class FriendsSideListComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(faMagnifyingGlass);
  }
}
