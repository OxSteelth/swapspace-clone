import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { SuccessStoriesComponent } from './success-stories.component';

@NgModule({
  declarations: [SuccessStoriesComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: SuccessStoriesComponent
      }
    ]),
  ]
})
export class SuccessStoriesModule {}
