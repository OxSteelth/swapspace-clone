import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-exchange-listing',
  templateUrl: './exchange-listing.component.html',
  styleUrls: ['./exchange-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeListingComponent {
  public index = 0;

  constructor() {}

  prev(): void {
    if (this.index - 1 < 0) this.index = 15;
    else this.index--;
  }

  next(): void {
    if (this.index + 1 >= 15) this.index = 0;
    else this.index++;
  }
}
