import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExchangeConfirmationComponent } from './exchange-confirmation.component';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmationCardComponent } from './components/confirmation-card/confirmation-card.component';
import { ExchangeConfirmationViewModel } from './viewmodel/exchange-confirmation.viewmodel.';

@NgModule({
  declarations: [
    ExchangeConfirmationComponent,
    ConfirmationCardComponent,
  ],
  providers: [ExchangeConfirmationViewModel],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExchangeConfirmationComponent,
      },
    ]),
  ],
})
export class ExchangeConfirmationModule {}
