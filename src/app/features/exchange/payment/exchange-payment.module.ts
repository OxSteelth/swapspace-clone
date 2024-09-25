import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExchangePaymentComponent } from './exchange-payment.component';
import { SharedModule } from '../../../shared/shared.module';
import { PaymentCardComponent } from './components/payment-card/payment-card.component';

@NgModule({
  declarations: [ExchangePaymentComponent, PaymentCardComponent],
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
