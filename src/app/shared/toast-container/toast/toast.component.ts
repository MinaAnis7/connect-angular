import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faExclamationCircle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Toast } from 'bootstrap';

@Component({
  selector: 'app-toast',
  imports: [FontAwesomeModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements AfterViewInit {
  @ViewChild('toast') toast!: ElementRef;
  @Input({ required: true }) isError!: boolean;
  @Input({ required: true }) message!: string;

  constructor(library: FaIconLibrary) {
    library.addIcons(faExclamationCircle, faInfoCircle);
  }

  ngAfterViewInit(): void {
    const toast = new Toast(this.toast.nativeElement, {
      delay: 5000,
    });

    toast.show();
  }
}
