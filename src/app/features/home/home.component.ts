import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CacheService } from '@app/shared/services/cache.service';
import { CurrencyService } from '@app/shared/services/currency.service';
import { ExchangeService } from '@app/shared/services/exchange.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private cacheService: CacheService, private exchangeService: ExchangeService) {}

  ngOnInit(): void {
    this.cacheService.updateExchangeStep(0);
  }

  ngOnDestroy(): void {
    this.exchangeService.stopInterval();

  }
}
