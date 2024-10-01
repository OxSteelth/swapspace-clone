import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { CacheService } from '@app/shared/services/cache.service';
import { IconStatus } from './type';

@Component({
  selector: 'app-exchange-status',
  templateUrl: './exchange-status.component.html',
  styleUrls: ['./exchange-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeStatusComponent {
  public exchangeInfo$ = this.cacheService.createdExchange$;
  public exchangeStep$ = this.cacheService.exchangeStep$;

  constructor(private cacheService: CacheService) {}

  calculateStatus(index: number): IconStatus {
    if (this.cacheService.exchangeStep === index) {
      return 'loading';
    }

    if (this.cacheService.exchangeStep > index) {
      return 'success';
    }

    return 'disabled';
  }
}
