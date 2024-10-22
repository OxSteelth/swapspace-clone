import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { ReviewsComponent } from './reviews.component';

@NgModule({
  declarations: [ReviewsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ReviewsComponent
      }
    ]),
  ]
})
export class ReviewsModule {}
