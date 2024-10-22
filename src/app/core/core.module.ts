import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LogoComponent } from './header/components/logo/logo.component';
import { NavbarComponent } from './header/components/navbar/navbar.component';
import { BurgerMenuComponent } from './header/components/burger-menu/burger-menu.component';
import { BlogComponent } from './header/components/blog/blog.component';
import { AcademyComponent } from './header/components/academy/academy.component';
import { PricePredictionsHeaderComponent } from './page-header/price-predictions-header/price-predictions-header.component';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LogoComponent,
    NavbarComponent,
    BurgerMenuComponent,
    BlogComponent,
    AcademyComponent,
    PricePredictionsHeaderComponent
  ],
  providers: [],
  imports: [CommonModule, SharedModule, InlineSVGModule.forRoot()],
  exports: [FooterComponent, HeaderComponent, PricePredictionsHeaderComponent]
})
export class CoreModule {}
