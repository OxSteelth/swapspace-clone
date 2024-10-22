import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { ContactsComponent } from './contacts.component';

@NgModule({
  declarations: [ContactsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ContactsComponent
      }
    ]),
  ]
})
export class ContactsModule {}
