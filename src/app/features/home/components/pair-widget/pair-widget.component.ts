import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-pair-widget',
    templateUrl: './pair-widget.component.html',
    styleUrls: ['./pair-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PairWidgetComponent {
}
