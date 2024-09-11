import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ExchangeBoxComponent } from './components/exchange-box/exchange-box.component';
import { CtaComponent } from './components/cta/cta.component';
import { SharedModule } from '../../shared/shared.module';
import { RecentTransactionsComponent } from './components/recent-transactions/recent-transactions.component';
import { RatesComponent } from './components/rates/rates.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ProductsComponent } from './components/products/products.component';
import { AdvantagesComponent } from './components/advantages/advantages.component';
import { FeaturesComponent } from './components/features/features.component';
import { HowComponent } from './components/how/how.component';
import { TrustUsComponent } from './components/trust-us/trust-us.component';
import { NewsComponent } from './components/news/news.component';
import { PairWidgetComponent } from './components/pair-widget/pair-widget.component';

@NgModule({
    declarations: [
        HomeComponent,
        ExchangeBoxComponent,
        CtaComponent,
        RecentTransactionsComponent,
        RatesComponent,
        CarouselComponent,
        ProductsComponent,
        AdvantagesComponent,
        FeaturesComponent,
        HowComponent,
        TrustUsComponent,
        NewsComponent,
        PairWidgetComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomeComponent
            }
        ])
    ]
})
export class HomeModule {}
