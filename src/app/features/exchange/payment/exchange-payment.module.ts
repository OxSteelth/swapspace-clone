import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExchangePaymentComponent } from './exchange-payment.component';
import { SharedModule } from '../../../shared/shared.module';
import { PaymentPanelComponent } from './components/payment-panel/payment-panel.component';
import { ConfirmedPanelComponent } from './components/confirmed-panel/confirmed-panel.component';
import { WalletModalComponent } from '@app/shared/components/wallet-modal/wallet-modal.component';

@NgModule({
  declarations: [
    ExchangePaymentComponent,
    PaymentPanelComponent,
    ConfirmedPanelComponent,
    WalletModalComponent
  ],
  providers: [],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExchangePaymentComponent
      }
    ])
  ]
})
export class ExchangePaymentModule {}
