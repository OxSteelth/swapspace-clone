import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { CacheService } from '@app/shared/services/cache.service';
import { IconStatus } from './type';

@Component({
  selector: 'app-exchange-info',
  templateUrl: './exchange-info.component.html',
  styleUrls: ['./exchange-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeInfoComponent {
  public exchangeInfo$ = this.cacheService.selectedOffer$;
  public confirmationStep$ = this.cacheService.exchangeStep$;

  constructor(private cacheService: CacheService) {}
}
