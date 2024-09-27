import { ExchangeService } from 'src/app/shared/services/exchange.service';
import { Component, OnInit } from '@angular/core';
import { currencyIconMap } from 'src/app/shared/currency-icon-map';
import { Router } from '@angular/router';
import { Exchange } from '@app/shared/models/exchange';
import { SwapFormService } from '@app/shared/services/swap-form.service';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  interval,
  map,
  of,
  startWith,
  switchMap
} from 'rxjs';
import { compareObjects } from '@app/shared/utils/utils';
import { StoreService } from '@app/shared/services/store/store.service';
import { CacheService } from '@app/shared/services/cache.service';

@Component({
  selector: 'app-available-exchange',
  templateUrl: './available-exchange.component.html',
  styleUrls: ['./available-exchange.component.scss']
})
export class AvailableExchangeComponent implements OnInit {
  sortOptions = ['Sort by relevance', 'Sort by rate', 'Sort by ETA'];
  skeletonArray = new Array(3);

  private readonly _availableExchanges$ = new BehaviorSubject<Exchange[]>([]);
  public readonly availableExchanges$ = this._availableExchanges$.asObservable();

  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading$.asObservable();

  constructor(
    public swapFormService: SwapFormService,
    public exchangeService: ExchangeService,
    private storeService: StoreService,
    private router: Router,
    private cacheService: CacheService
  ) {}

  ngOnInit() {

    this.cacheService.filteredExchanges$.subscribe(value =>
      this._availableExchanges$.next(value)
    );

    combineLatest([this.cacheService.availableExchanges$, this.cacheService.isFilterFixedRate$, this.cacheService.isFilterFloatingRate$])
      .pipe(distinctUntilChanged())
      .subscribe(([availableExchanges, fixedRate, floatingRate]) => {
        const value = availableExchanges.filter(
          v => v.fixed === fixedRate || v.fixed !== floatingRate
        );
        this.cacheService.updateFilteredExchanges(value);
      });

    combineLatest([
      this.swapFormService.inputControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged((prevInput, currInput) => compareObjects(prevInput, currInput))
      ),
      this.exchangeService.interval$
    ])
      .pipe(
        switchMap(([value]) => {
          if (
            value.fromBlockchain !== '' &&
            value.toBlockchain !== '' &&
            value.fromToken &&
            value.toToken &&
            value.fromAmount
          ) {
            this._isLoading$.next(true);

            const res = this.exchangeService.getEstimatedExchangeAmounts({
              fromCurrency: value.fromToken.code,
              fromNetwork: value.fromBlockchain,
              toNetwork: value.toBlockchain,
              toCurrency: value.toToken.code,
              amount: value.fromAmount,
              direction: 'direct',
              estimated: true.toString(),
              isContentPage: false.toString()
            });

            return res;
          } else {
            return of([]);
          }
        })
      )
      .subscribe((value: Exchange[]) => {
        if (Array.isArray(value) && value.length > 0) {
          this.cacheService.updateAvailableExchanges(value);
        } else {
          this.cacheService.updateAvailableExchanges([]);
        }

        this._isLoading$.next(false);
      });
  }

  getCurrencyIcon(currency: string): string {
    return currencyIconMap[currency as keyof typeof currencyIconMap];
  }

  onTabChange(event: any) {
    if (event === 0) {
      this.exchangeService.sortExchanges('relevance');
    } else if (event === 1) {
      this.exchangeService.sortExchanges('rate');
    } else {
      this.exchangeService.sortExchanges('eta');
    }
  }

  exchangeCurrency(exchange: Exchange) {
    this.cacheService.updateSelectedOffer(exchange);

    combineLatest([
      this.cacheService.fromToken$,
      this.cacheService.fromChain$,
      this.cacheService.fromAmount$,
      this.cacheService.toToken$,
      this.cacheService.toChain$,
      this.cacheService.selectedOffer$
    ]).subscribe(([fromToken, fromChain, fromAmount, toToken, toChain, selectedOffer]) => {
      this.cacheService.updateExchangeStep(1);
      this.router.navigate(['/exchange/step2'], {
        queryParams: {
          from: fromToken,
          fromChain,
          to: toToken,
          toChain,
          amount: fromAmount,
          partner: selectedOffer.partner,
          fixed: selectedOffer.fixed
        },
        queryParamsHandling: 'merge'
      });
    });
  }
}
