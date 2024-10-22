import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-invaders',
  templateUrl: './invaders.component.html',
  styleUrls: ['./invaders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvadersComponent {
  isOpened: boolean[] = [false, false, false, false];

  toggle(index: number): void {
    this.isOpened[index] = !this.isOpened[index];
  }
}
