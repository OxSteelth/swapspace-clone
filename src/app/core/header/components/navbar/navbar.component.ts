import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenuList, MENUS_LIST } from '@core/header/models/menus-list';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  public menus: MenuList[] = MENUS_LIST;
}
