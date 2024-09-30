import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exchange-finished-status',
  templateUrl: './exchange-finished-status.component.html',
  styleUrls: ['./exchange-finished-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeFinishedStatusComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
