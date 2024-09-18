import { ExchangeService } from 'src/app/shared/services/exchange.service';
import { Component } from '@angular/core';
import { currencyIconMap } from 'src/app/shared/currency-icon-map';
import { Router } from '@angular/router';
import { Exchange } from '@app/shared/models/exchange';
import { SwapFormService } from '@app/shared/services/swap-form.service';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap
} from 'rxjs';
import { compareObjects } from '@app/shared/utils/utils';

@Component({
  selector: 'app-available-exchange',
  templateUrl: './available-exchange.component.html',
  styleUrls: ['./available-exchange.component.scss']
})
export class AvailableExchangeComponent {
  sortOptions = ['Sort by relevance', 'Sort by rate', 'Sort by ETA'];
  skeletonArray = new Array(3);

  private readonly _availableExchanges$ = new BehaviorSubject<Exchange[]>([]);
  public readonly availableExchanges$ = this._availableExchanges$.asObservable();

  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading$.asObservable();

  constructor(
    public swapFormService: SwapFormService,
    public exchangeService: ExchangeService,
    private router: Router
  ) {
    this.exchangeService.estimatedExchange$.subscribe(value =>
      this._availableExchanges$.next(value)
    );

    combineLatest([
      this.swapFormService.inputControl.valueChanges,
      this.exchangeService.fixedRate$,
      this.exchangeService.floatingRate$,
      this.exchangeService.interval$
    ])
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (
            [prevInput, prevFixedRate, prevFloatingRate, prevInterval],
            [currInput, currFixedRate, currFloatingRate, currInterval]
          ) =>
            compareObjects(prevInput, currInput) &&
            prevFixedRate === currFixedRate &&
            prevFloatingRate === currFloatingRate &&
            prevInterval === currInterval
        ),
        switchMap(([value, fixedRate, floatingRate]) => {
          if (
            value.fromBlockchain !== '' &&
            value.toBlockchain !== '' &&
            value.fromToken &&
            value.toToken &&
            value.fromAmount
          ) {
            this._isLoading$.next(true);

            const res = this.exchangeService
              .getEstimatedExchangeAmounts(
                value.fromToken.code,
                value.fromBlockchain,
                value.toBlockchain,
                value.toToken.code,
                Number(value.fromAmount)
              )
              .pipe(
                map(val => val?.filter(v => v.fixed === fixedRate || v.fixed !== floatingRate))
              );

            return res;
          } else {
            return of([]);
          }
        })
      )
      .subscribe((value: Exchange[]) => {
        if (Array.isArray(value) && value.length > 0) {
          this.exchangeService.updatedEstimatedExchange(value);
        } else {
          this.exchangeService.updatedEstimatedExchange([]);
        }

        this._isLoading$.next(false);
      });
  }

  ngOnInit() {}

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
    this.exchangeService.updateSelectedOffer(exchange);
    this.router.navigate(['/exchange/step2'], {
      queryParams: {
        fromCurrency: this.swapFormService.inputValue.fromToken.code,
        fromNetwork: this.swapFormService.inputValue.fromBlockchain,
        toCurrency: this.swapFormService.inputValue.toToken.code,
        toNetwork: this.swapFormService.inputValue.toBlockchain,
        amount: this.swapFormService.inputValue.fromAmount,
        partner: this.exchangeService.selectedOffer.partner,
        fixed: this.exchangeService.fixedRate
      }
    });
  }
}
