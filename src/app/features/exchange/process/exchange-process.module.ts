import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExchangeProcessComponent } from './exchange-process.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProcessCardComponent } from './components/process-card/process-card.component';

@NgModule({
  declarations: [ExchangeProcessComponent, ProcessCardComponent],
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
