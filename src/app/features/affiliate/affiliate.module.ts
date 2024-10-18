import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from '@shared/shared.module';
import { AffiliateComponent } from './affiliate.component';

@NgModule({
  declarations: [AffiliateComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: AffiliateComponent
      }
    ]),
    ScrollingModule
  ]
})
export class AffiliateModule {}
