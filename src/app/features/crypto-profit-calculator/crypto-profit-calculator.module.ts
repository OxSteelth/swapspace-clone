import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { CryptoProfitCalculatorComponent } from './crypto-profit-calculator.component';

@NgModule({
  declarations: [CryptoProfitCalculatorComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CryptoProfitCalculatorComponent
      }
    ]),
  ]
})
export class CryptoProfitCalculatorModule {}
