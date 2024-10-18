import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from '@shared/shared.module';
import { ApiComponent } from './api.component';

@NgModule({
  declarations: [ApiComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ApiComponent
      }
    ]),
    ScrollingModule
  ]
})
export class ApiModule {}
