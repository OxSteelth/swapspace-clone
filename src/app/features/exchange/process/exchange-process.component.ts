import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CurrencyService } from '@app/shared/services/currency.service';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';

@Component({
  selector: 'app-exchange-process',
  templateUrl: './exchange-process.component.html',
  styleUrls: ['./exchange-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeProcessComponent implements OnInit {
  constructor(private swapFormQueryService: SwapFormQueryService) {}

  ngOnInit(): void {
    this.swapFormQueryService.subscribeOnStep34QueryParams();
  }
}
