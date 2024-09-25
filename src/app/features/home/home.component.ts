import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyService } from '@app/shared/services/currency.service';
import { ExchangeService } from '@app/shared/services/exchange.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private currencyService: CurrencyService, private exchangeService: ExchangeService) {}

  ngOnInit(): void {
    this.currencyService.fetchCurrencyList();
  }

  ngOnDestroy(): void {
    this.exchangeService.stopInterval();
  }
}
