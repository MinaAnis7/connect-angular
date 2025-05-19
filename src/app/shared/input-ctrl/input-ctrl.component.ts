import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Output() valueChanged = new EventEmitter<string>();

  onValueChanges(val: string) {
    this.valueChanged.emit(val);
  }
}
