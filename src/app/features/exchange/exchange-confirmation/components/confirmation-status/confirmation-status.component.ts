import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExchangeConfirmationViewModel } from '../../viewmodel/exchange-confirmation.viewmodel.';
import { IconStatus } from '../../type';
import { ExchangeService } from '@app/shared/services/exchange.service';

@Component({
  selector: 'app-confirmation-status',
  templateUrl: './confirmation-status.component.html',
  styleUrls: ['./confirmation-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationStatusComponent {
  public exchangeInfo$ = this.exchangeService.selectedOffer$;

  constructor(
    public exchangeConfirmationViewModel: ExchangeConfirmationViewModel,
    private exchangeService: ExchangeService
  ) {
    this.exchangeInfo$.subscribe(v => console.log(v))
  }

  calculateStatus(index: number): IconStatus {
    if (this.exchangeConfirmationViewModel.confirmationStep() === index) {
      return 'loading';
    }

    if (this.exchangeConfirmationViewModel.confirmationStep() > index) {
      return 'success';
    }

    return 'disabled';
  }
}
