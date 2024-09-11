import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-exchange-list',
  templateUrl: './exchange-list.component.html',
  styleUrls: ['./exchange-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeListComponent { }
