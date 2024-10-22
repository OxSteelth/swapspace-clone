import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { BlogComponent } from './blog.component';

@NgModule({
  declarations: [BlogComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: BlogComponent
      },
      {
        path: 'categories/opinion',
        component: BlogComponent
      },
      {
        path: 'categories/academy',
        component: BlogComponent
      },
      {
        path: 'categories/guides',
        component: BlogComponent
      },
      {
        path: 'categories/announcements',
        component: BlogComponent
      }
    ]),
  ]
})
export class BlogModule {}
