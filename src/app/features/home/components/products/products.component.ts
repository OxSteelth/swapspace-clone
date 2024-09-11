import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fromEvent, map } from 'rxjs';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
    scrollPostion$ = fromEvent(window, 'scroll').pipe(map(() => window.scrollY));

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
