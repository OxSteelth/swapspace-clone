import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from '@shared/shared.module';
import { ExchangeListingComponent } from './exchange-listing.component';

@NgModule({
  declarations: [ExchangeListingComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExchangeListingComponent
      }
    ]),
    ScrollingModule
  ]
})
export class ExchangeListingModule {}
