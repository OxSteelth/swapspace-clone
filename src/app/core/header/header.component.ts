import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService]
})
export class HeaderComponent {}
