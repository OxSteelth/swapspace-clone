import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiComponent {
  index: number = 0;

  styles = [
    { 'z-index': 3, transform: 'translateX(0px)' },
    { 'z-index': 2, transform: 'translateX(var(--offset))' },
    { 'z-index': 1, transform: 'translateX(calc(var(--offset) * 2))' }
  ];

  constructor() {}

  slide(i: number): void {
    if (this.index < i) {
      let rounds = i - this.index;
      while (rounds-- > 0) {
        this.styles.unshift(this.styles.pop());
      }
    } else if (this.index > i) {
      let rounds = this.index - i;
      while (rounds-- > 0) {
        this.styles.push(this.styles.shift());
      }
    }
    this.index = i;
  }
}
