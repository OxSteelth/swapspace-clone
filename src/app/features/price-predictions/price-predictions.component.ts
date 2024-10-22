import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-price-predictions',
  templateUrl: './price-predictions.component.html',
  styleUrls: ['./price-predictions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricePredictionsComponent {}
