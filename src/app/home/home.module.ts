import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ExchangeBoxComponent } from './components/exchange-box/exchange-box.component';
import { CtaComponent } from './components/cta/cta.component';
import { SharedModule } from '../shared/shared.module';
import { RecentTransactionsComponent } from './components/recent-transactions/recent-transactions.component';
import { HeroesComponent } from './components/heroes/heroes.component';

@NgModule({
  declarations: [
    HomeComponent,
    ExchangeBoxComponent,
    CtaComponent,
    RecentTransactionsComponent,
    HeroesComponent,
  ],
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
