import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyService } from '@app/shared/services/currency.service';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';

@Component({
  selector: 'app-exchange-create',
  templateUrl: './exchange-create.component.html',
  styleUrls: ['./exchange-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeCreateComponent implements OnInit, OnDestroy {
  constructor(
    private swapFormQueryService: SwapFormQueryService,
    private exchangeService: ExchangeService
  ) {}

  ngOnInit(): void {
    this.exchangeService.startInterval();
    this.swapFormQueryService.subscribeOnStep2QueryParams();
  }

  ngOnDestroy(): void {
    this.exchangeService.stopInterval();
  }
}
