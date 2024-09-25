import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExchangeConfirmationViewModel } from '../../viewmodel/exchange-confirmation.viewmodel.';
import { IconStatus } from '../../type';
import { ExchangeService } from '@app/shared/services/exchange.service';

@Component({
  selector: 'app-confirmation-status',
  templateUrl: './confirmation-status.component.html',
  styleUrls: ['./confirmation-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationStatusComponent {
  public exchangeInfo$ = this.exchangeService.selectedOffer$;
  public confirmationStep$ = this.exchangeService.confirmationStep$;

  constructor(private exchangeService: ExchangeService) {}

  calculateStatus(index: number): IconStatus {
    if (this.exchangeService.confirmationStep === index) {
      return 'loading';
    }

    if (this.exchangeService.confirmationStep > index) {
      return 'success';
    }

    return 'disabled';
  }
}
