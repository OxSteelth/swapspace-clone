import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LogoComponent } from './header/components/logo/logo.component';
import { NavbarComponent } from './header/components/navbar/navbar.component';
import { BurgerMenuComponent } from './header/components/burger-menu/burger-menu.component';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LogoComponent,
    NavbarComponent,
    BurgerMenuComponent
  ],
  providers: [],
  imports: [CommonModule, SharedModule, InlineSVGModule.forRoot()],
  exports: [FooterComponent, HeaderComponent]
})
export class CoreModule {}
