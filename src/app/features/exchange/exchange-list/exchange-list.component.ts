import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Exchange } from '@app/shared/models/exchange';
import { CurrencyService } from '@app/shared/services/currency.service';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';
import { SwapFormService } from '@app/shared/services/swap-form.service';
import { compareObjects } from '@app/shared/utils/utils';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap
} from 'rxjs';

@Component({
  selector: 'app-exchange-list',
  templateUrl: './exchange-list.component.html',
  styleUrls: ['./exchange-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeListComponent implements OnInit, OnDestroy {
  constructor(
    private swapFormQueryService: SwapFormQueryService,
    private currencyService: CurrencyService,
    private exchangeService: ExchangeService
  ) {}

  ngOnInit(): void {
    this.swapFormQueryService.subscribeOnQueryParams();
    this.exchangeService.startInterval();
  }

  ngOnDestroy(): void {
    this.exchangeService.stopInterval()
  }
}
