import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { InvadersComponent } from './invaders.component';

@NgModule({
  declarations: [InvadersComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: InvadersComponent
      }
    ]),
  ]
})
export class InvadersModule {}
