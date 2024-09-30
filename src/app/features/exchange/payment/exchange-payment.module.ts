import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExchangePaymentComponent } from './exchange-payment.component';
import { SharedModule } from '../../../shared/shared.module';
import { PaymentCardComponent } from './components/payment-card/payment-card.component';
import { ConfirmedCardComponent } from './components/confirmed-card/confirmed-card.component';
import { WalletModalComponent } from '@app/shared/components/wallet-modal/wallet-modal.component';

@NgModule({
  declarations: [ExchangePaymentComponent, PaymentCardComponent, ConfirmedCardComponent, WalletModalComponent],
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
