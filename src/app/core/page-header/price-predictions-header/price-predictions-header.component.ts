import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-price-predictions-header',
  templateUrl: './price-predictions-header.component.html',
  styleUrls: ['./price-predictions-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricePredictionsHeaderComponent {}
