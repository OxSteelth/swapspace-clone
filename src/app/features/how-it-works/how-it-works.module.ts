import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { HowItWorksComponent } from './how-it-works.component';

@NgModule({
  declarations: [HowItWorksComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: HowItWorksComponent
      }
    ]),
  ]
})
export class HowItWorksModule {}
