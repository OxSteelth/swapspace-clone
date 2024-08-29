import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-exchange-box',
  templateUrl: './exchange-box.component.html',
  styleUrls: ['./exchange-box.component.scss'],
})
export class ExchangeBoxComponent {
  readonly testForm = new FormGroup({
    testValue: new FormControl(''),
  });

  items = [
    'BTC',
    'ETH',
    'LTC',
    'XRP',
    'BCH',
    'ADA',
    'DOT',
    'LINK',
    'BNB',
    'XLM',
  ];
}
