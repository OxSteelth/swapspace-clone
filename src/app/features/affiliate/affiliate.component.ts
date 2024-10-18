import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffiliateComponent {
  constructor() {}
}
