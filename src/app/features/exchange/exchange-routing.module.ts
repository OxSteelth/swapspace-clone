import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'step1',
    loadChildren: () =>
      import('./exchange-list/exchange-list.module').then(
        (m) => m.ExchangeListModule
      ),
  },
  {
    path: 'confirmation',
    loadChildren: () =>
      import('./exchange-confirmation/exchange-confirmation.module').then(
        (m) => m.ExchangeConfirmationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangeRoutingModule {}
