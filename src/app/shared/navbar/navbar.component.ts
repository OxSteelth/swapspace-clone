import { ChangeDetectionStrategy, Component } from '@angular/core';

type DropdownItem = 'products';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  isDropdownOpen = false;
}
