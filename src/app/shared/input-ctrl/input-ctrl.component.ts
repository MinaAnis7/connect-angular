import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-ctrl',
  templateUrl: './input-ctrl.component.html',
  styleUrl: './input-ctrl.component.css',
  host: {
    '[class]': `{
      'rounded-4': this.isRounded,
    }`,
  },
})
export class InputCtrlComponent {
  @Input() isRounded = false;
  @Input({ required: true }) placeholder!: string;
}
