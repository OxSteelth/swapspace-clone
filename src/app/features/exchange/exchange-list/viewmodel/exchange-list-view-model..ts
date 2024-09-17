import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Exchange } from '@app/shared/models/exchange';
import { SwapFormService } from '@app/shared/services/swap-form.service';
import { compareObjects } from '@app/shared/utils/utils';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { ExchangeService } from 'src/app/shared/services/exchange.service';
import { AvailableExchange, CurrencyOption } from 'src/app/shared/types';

@Injectable()
export class ExchangeListViewModel {
  currencyToSendFormControl = new FormControl<string>('BTC', [Validators.required]);
  valueToSendFormControl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0)
  ]);

  valueToGetFormControl = new FormControl<number | null>(null, [Validators.min(0)]);

  currencyToGetFormControl = new FormControl<string>('USD', [Validators.required]);

  form = new FormGroup({
    valueToSend: this.valueToSendFormControl,
    currencyToSend: this.currencyToSendFormControl,
    valueToGet: this.valueToGetFormControl,
    currencyToGet: this.currencyToGetFormControl
  });

  currencyList$ = this.currencyService.currencyList$;

  // availableExchanges$ = this.exchangeService.getAvailableExchanges();

  private readonly _availableExchanges$ = new BehaviorSubject<Exchange[]>([]);
  public readonly availableExchanges$ = this._availableExchanges$.asObservable();

  constructor(
    public currencyService: CurrencyService,
    public exchangeService: ExchangeService,
    public swapFormService: SwapFormService
  ) {
    this.exchangeService.estimatedExchange$.subscribe(value =>
      this._availableExchanges$.next(value)
    );

    combineLatest([
      this.swapFormService.inputControl.valueChanges,
      this.exchangeService.fixedRate$,
      this.exchangeService.floatingRate$
    ])
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (
            [prevInput, prevFixedRate, prevFloatingRate],
            [currInput, currFixedRate, currFloatingRate]
          ) =>
            compareObjects(prevInput, currInput) &&
            prevFixedRate === currFixedRate &&
            prevFloatingRate === currFloatingRate
        ),
        switchMap(([value, fixedRate, floatingRate]) => {
          if (
            value.fromBlockchain !== '' &&
            value.toBlockchain !== '' &&
            value.fromToken &&
            value.toToken &&
            value.fromAmount
          ) {
            const res = this.exchangeService
              .getEstimatedExchangeAmounts(
                value.fromToken.code,
                value.fromBlockchain,
                value.toBlockchain,
                value.toToken.code,
                Number(value.fromAmount)
              )
              .pipe(map(val => val?.filter(v => v.fixed === fixedRate || v.fixed !== floatingRate)));

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
      });
  }

  public sortBy(field: string) {
    this.exchangeService.estimatedExchange$.subscribe(value => {
      this._availableExchanges$.next(
        value.sort((a, b) => {
          if (field === 'relevance') {
            return b.toAmount - a.toAmount;
          } else if (field === 'rate') {
            return b.toAmount - a.toAmount;
          } else if (field === 'eta') {
            const aEta = a.duration.split('-').reduce((result, v) => Number(result) + Number(v), 0);
            const bEta = b.duration.split('-').reduce((result, v) => Number(result) + Number(v), 0);
            return aEta - bEta;
          } else {
            return 1;
          }
        })
      );
    });
  }
}
