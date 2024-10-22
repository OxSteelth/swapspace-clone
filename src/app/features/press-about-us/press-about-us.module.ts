import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { PressAboutUsComponent } from './press-about-us.component';

@NgModule({
  declarations: [PressAboutUsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: PressAboutUsComponent
      }
    ]),
  ]
})
export class PressAboutUsModule {}
