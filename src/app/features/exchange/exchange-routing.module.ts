import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'step1',
    loadChildren: () =>
      import('./list/exchange-list.module').then(m => m.ExchangeListModule)
  },
  {
    path: 'step2',
    loadChildren: () =>
      import('./create/exchange-create.module').then(
        m => m.ExchangeCreateModule
      )
  },
  {
    path: 'step3',
    loadChildren: () =>
      import('./payment/exchange-payment.module').then(m => m.ExchangePaymentModule)
  },
  {
    path: 'step4',
    loadChildren: () =>
      import('./process/exchange-process.module').then(m => m.ExchangeProcessModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRoutingModule {}
