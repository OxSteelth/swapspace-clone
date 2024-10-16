import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenuList, MENUS_LIST } from '@core/header/models/menus-list';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BurgerMenuComponent {
  public menus: MenuList[] = MENUS_LIST;

  public isOpened: boolean = false;

  public toggle(): void {
    this.isOpened = !this.isOpened;
  }
}
