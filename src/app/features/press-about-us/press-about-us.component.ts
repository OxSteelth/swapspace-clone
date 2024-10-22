import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-press-about-us',
  templateUrl: './press-about-us.component.html',
  styleUrls: ['./press-about-us.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PressAboutUsComponent {
  index: number = 0;

  pages: number = 3;

  onIndex(index: number): void {
    this.index = index;
  }

  prev(): void {
    if (this.index <= 0) return;
    this.index--;
  }

  next(): void {
    if (this.index >= this.pages - 1) return;
    this.index++;
  }
}
