import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExchangeConfirmationViewModel } from '../../viewmodel/exchange-confirmation.viewmodel.';
import { IconStatus } from '../../type';

@Component({
  selector: 'app-confirmation-status',
  templateUrl: './confirmation-status.component.html',
  styleUrls: ['./confirmation-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationStatusComponent {
  constructor(
    public exchangeConfirmationViewModel: ExchangeConfirmationViewModel
  ) {}

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
