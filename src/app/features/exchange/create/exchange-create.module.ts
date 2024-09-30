import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExchangeCreateComponent } from './exchange-create.component';
import { SharedModule } from '../../../shared/shared.module';
import { ExchangeCreatePanelComponent } from './components/exchange-create-panel/exchange-create-panel.component';

@NgModule({
  declarations: [
    ExchangeCreateComponent,
    ExchangeCreatePanelComponent,
  ],
  providers: [],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExchangeCreateComponent,
      },
    ]),
  ],
})
export class ExchangeCreateModule {}
