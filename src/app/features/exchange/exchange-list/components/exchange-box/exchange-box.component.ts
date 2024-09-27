import { Component, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ExchangeService } from '@app/shared/services/exchange.service';
import { CacheService } from '@app/shared/services/cache.service';

@Component({
  selector: 'app-exchange-box',
  templateUrl: './exchange-box.component.html',
  styleUrls: ['./exchange-box.component.scss']
})
export class ExchangeBoxComponent {
  sub!: Subscription;
  isEstimatingExchange = signal(false);
  selectedAction = 'exchange';
  fixedRate = true;
  floatingRate = true;

  public rateOptionsForm = new FormGroup({
    fixedRateControl: new FormControl(true),
    floatingRateControl: new FormControl(true)
  });

  constructor(public exchangeService: ExchangeService, private cacheService: CacheService) {}

  filterAmounts() {
    this.cacheService.updateIsFilterFixedRate(this.fixedRate);
    this.cacheService.updateIsFilterFloatingRate(this.floatingRate);
    this.exchangeService.updateFixedRate(this.fixedRate);
    this.exchangeService.updateFloatingRate(this.floatingRate);
  }
}
