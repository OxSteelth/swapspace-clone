import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExchangeListComponent } from './exchange-list.component';
import { ExchangeBoxComponent } from './components/exchange-box/exchange-box.component';
import { SharedModule } from '../../../shared/shared.module';
import { AvailableExchangeComponent } from './components/available-exchange/available-exchange.component';
import { ExchangeListViewModel } from './viewmodel/exchange-list-view-model.';

@NgModule({
  declarations: [
    ExchangeListComponent,
    ExchangeBoxComponent,
    AvailableExchangeComponent,
  ],
  providers: [ExchangeListViewModel],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExchangeListComponent,
      },
    ]),
  ],
})
export class ExchangeListModule {}
