import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { NewsComponent } from './news.component';

@NgModule({
  declarations: [NewsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: NewsComponent
      }
    ]),
  ]
})
export class NewsModule {}
