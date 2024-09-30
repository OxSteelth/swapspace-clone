import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExchangeConfirmationComponent } from './exchange-confirmation.component';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmationCardComponent } from './components/confirmation-card/confirmation-card.component';

@NgModule({
  declarations: [
    ExchangeConfirmationComponent,
    ConfirmationCardComponent,
  ],
  providers: [],
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
