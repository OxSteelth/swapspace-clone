import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ExchangeBoxComponent } from './components/exchange-box/exchange-box.component';
import { CtaComponent } from './components/cta/cta.component';
import { SharedModule } from '../../../shared/shared.module';
import { RecentTransactionsComponent } from './components/recent-transactions/recent-transactions.component';
import { TransactionService } from './services/transaction.service';

@NgModule({
  declarations: [
    HomeComponent,
    ExchangeBoxComponent,
    CtaComponent,
    RecentTransactionsComponent,
  ],
  providers: [TransactionService],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
})
export class HomeModule {}
