import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CacheService } from '@app/shared/services/cache.service';
import { CurrencyService } from '@app/shared/services/currency.service';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';

@Component({
  selector: 'app-exchange-process',
  templateUrl: './exchange-process.component.html',
  styleUrls: ['./exchange-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeProcessComponent implements OnInit {

  public exchangeStatus$ = this.cacheService.exchangeStatus$;

  constructor(private swapFormQueryService: SwapFormQueryService, private cacheService: CacheService) {}

  ngOnInit(): void {
    this.swapFormQueryService.subscribeOnStep34QueryParams();
  }
}
