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
  },
  {
    path: 'news',
    loadChildren: () => import('./features/news/news.module').then(m => m.NewsModule)
  },
  {
    path: 'press-about-us',
    loadChildren: () => import('./features/press-about-us/press-about-us.module').then(m => m.PressAboutUsModule)
  },
  {
    path: 'partners',
    loadChildren: () => import('./features/partners/partners.module').then(m => m.PartnersModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./features/contacts/contacts.module').then(m => m.ContactsModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./features/reviews/reviews.module').then(m => m.ReviewsModule)
  },
  {
    path: 'success-stories',
    loadChildren: () => import('./features/success-stories/success-stories.module').then(m => m.SuccessStoriesModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./features/blog/blog.module').then(m => m.BlogModule)
  },
  {
    path: 'academy',
    loadChildren: () => import('./features/academy/academy.module').then(m => m.AcademyModule)
  },
  {
    path: 'price-predictions',
    loadChildren: () => import('./features/price-predictions/price-predictions.module').then(m => m.PricePredictionsModule)
  },
  {
    path: 'crypto-profit-calculator',
    loadChildren: () => import('./features/crypto-profit-calculator/crypto-profit-calculator.module').then(m => m.CryptoProfitCalculatorModule)
  },
  {
    path: 'invaders',
    loadChildren: () => import('./features/invaders/invaders.module').then(m => m.InvadersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
