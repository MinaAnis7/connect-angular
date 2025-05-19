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
  @Output() focused = new EventEmitter<boolean>();

  onValueChanges(val: string) {
    this.valueChanged.emit(val);
  }

  onFocus() {
    this.focused.emit(true);
  }
}
