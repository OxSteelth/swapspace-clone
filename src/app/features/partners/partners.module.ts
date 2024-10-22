import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { PartnersComponent } from './partners.component';

@NgModule({
  declarations: [PartnersComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: PartnersComponent
      }
    ]),
  ]
})
export class PartnersModule {}
