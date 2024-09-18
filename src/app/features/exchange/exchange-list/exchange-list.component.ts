import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Exchange } from '@app/shared/models/exchange';
import { CurrencyService } from '@app/shared/services/currency.service';
import { ExchangeService } from '@app/shared/services/exchange.service';
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
export class ExchangeListComponent {
  private readonly _availableExchanges$ = new BehaviorSubject<Exchange[]>([]);
  public readonly availableExchanges$ = this._availableExchanges$.asObservable();

  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading$.asObservable();

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
