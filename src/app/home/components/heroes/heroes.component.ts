import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { fromEvent, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent {
  subs: Subscription[] = [];

  scrollPostion$ = fromEvent(window, 'scroll').pipe(map(() => window.scrollY));

  ngOnInit(): void {}

  calculateAnimationProgress(element: HTMLDivElement) {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;
    const viewportHeight = window.innerHeight;

    let progress = 0;

    if (elementTop < viewportHeight) {
      progress = (viewportHeight - elementTop) / (elementBottom - elementTop);
    }

    return Math.min(1, progress);
  }
}
