import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-read-more',
  imports: [],
  templateUrl: './read-more.component.html',
  styleUrl: './read-more.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadMoreComponent {
  text = input.required<string>();
  toggled = signal(false);

  shouldCollapse = computed(() => {
    return this.text().split('').length / 5 > 74 && !this.toggled();
  });

  toggleReadMore() {
    this.toggled.update((val) => !val);
  }
}
