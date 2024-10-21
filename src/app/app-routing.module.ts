import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'exchange',
    loadChildren: () =>
      import('./features/exchange/exchange-routing.module').then(m => m.ExchangeRoutingModule)
  },
  {
    path: 'exchange-listing',
    loadChildren: () =>
      import('./features/exchange-listing/exchange-listing.module').then(
        m => m.ExchangeListingModule
      )
  },
  {
    path: 'affiliate',
    loadChildren: () => import('./features/affiliate/affiliate.module').then(m => m.AffiliateModule)
  },
  {
    path: 'api',
    loadChildren: () => import('./features/api/api.module').then(m => m.ApiModule)
  },
  {
    path: 'how-it-works',
    loadChildren: () => import('./features/how-it-works/how-it-works.module').then(m => m.HowItWorksModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./features/faq/faq.module').then(m => m.FaqModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./features/about/about.module').then(m => m.AboutModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
