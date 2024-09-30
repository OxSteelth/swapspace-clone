import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExchangeProcessComponent } from './exchange-process.component';
import { SharedModule } from '../../../shared/shared.module';
import { ExchangeProcessPanelComponent } from './components/process-panel/process-panel.component';
import { ExchangeFinishedStatusComponent } from '../finished-status/exchange-finished-status.component';
import { ExchangeReviewComponent } from '../review/exchange-review.component';

@NgModule({
  declarations: [
    ExchangeProcessComponent,
    ExchangeProcessPanelComponent,
    ExchangeFinishedStatusComponent,
    ExchangeReviewComponent
  ],
  providers: [],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExchangeProcessComponent
      }
    ])
  ]
})
export class ExchangeProcessModule {}
