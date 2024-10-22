import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { AcademyComponent } from './academy.component';

@NgModule({
  declarations: [AcademyComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: AcademyComponent
      }
    ]),
  ]
})
export class AcademyModule {}
