import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { PricePredictionsComponent } from './price-predictions.component';

@NgModule({
  declarations: [PricePredictionsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: PricePredictionsComponent
      }
    ]),
  ]
})
export class PricePredictionsModule {}
