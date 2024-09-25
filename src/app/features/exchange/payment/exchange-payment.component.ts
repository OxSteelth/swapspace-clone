import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CurrencyService } from '@app/shared/services/currency.service';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';

@Component({
  selector: 'app-exchange-payment',
  templateUrl: './exchange-payment.component.html',
  styleUrls: ['./exchange-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangePaymentComponent implements OnInit {
  constructor(
    private swapFormQueryService: SwapFormQueryService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.currencyService.fetchCurrencyList();
    this.swapFormQueryService.subscribeOnQueryParams();
    this.swapFormQueryService.subscribeOnSwapForm();
  }
}
