import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Exchange } from '@app/shared/models/exchange';
import { BehaviorSubject, map, Observable } from 'rxjs';
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

  constructor(public currencyService: CurrencyService, public exchangeService: ExchangeService) {
    this.exchangeService.estimatedExchange$.subscribe(value =>
      this._availableExchanges$.next(value)
    );
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
            console.log('here');
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
