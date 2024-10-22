import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent {
  collapsed: boolean[] = [false, false, false];

  tabIndex: number = 0;

  toggle(index: number): void {
    this.collapsed[index] = !this.collapsed[index];
  }

  onTab(index: number): void {
    this.tabIndex = index;
  }
}
