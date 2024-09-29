import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExchangeConfirmationViewModel } from '../../viewmodel/exchange-confirmation.viewmodel.';
import { IconStatus } from '../../type';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { CacheService } from '@app/shared/services/cache.service';

@Component({
  selector: 'app-confirmation-status',
  templateUrl: './confirmation-status.component.html',
  styleUrls: ['./confirmation-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationStatusComponent {
  public exchangeInfo$ = this.cacheService.selectedOffer$;
  public confirmationStep$ = this.cacheService.exchangeStep$;

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
