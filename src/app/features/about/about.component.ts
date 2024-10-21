import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  index: number = 0;

  readonly length = 8;

  readonly itemsCount = 3;

  get rounded(): number {
    return this.index;
  }

  onIndex(index: number): void {
    this.index = index * this.itemsCount;
  }

  prev(): void {
    if (this.index - 1 < 0) {
      this.index = this.length - this.itemsCount;
    } else {
      this.index--;
    }
  }

  next(): void {
    if (this.index + 1 > this.length - this.itemsCount) {
      this.index = 0;
    } else {
      this.index++;
    }
  }
}
