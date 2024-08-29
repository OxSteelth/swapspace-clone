import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExchangeService } from './../../shared/services/exchange.service';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, switchMap } from 'rxjs';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { CurrencyOption } from 'src/app/shared/types';

@Injectable()
export class HomeExchangeViewModel {
  currencyToSendFormControl = new FormControl<string>('BTC', [
    Validators.required,
  ]);
  valueToSendFormControl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0),
  ]);

  valueToGetFormControl = new FormControl<number | null>(null, [
    Validators.min(0),
  ]);

  currencyToGetFormControl = new FormControl<string>('ETH', [
    Validators.required,
  ]);

  form = new FormGroup({
    valueToSend: this.valueToSendFormControl,
    currencyToSend: this.currencyToSendFormControl,
    valueToGet: this.valueToGetFormControl,
    currencyToGet: this.currencyToGetFormControl,
  });

  currencyList$: Observable<CurrencyOption[]>;

  constructor(
    public currencyService: CurrencyService,
    public exchangeService: ExchangeService
  ) {
    this.currencyList$ = this.currencyService.currencyList$;
  }

  async estimateExchange() {
    const value = this.valueToSendFormControl.value;
    const currencyToSend = this.currencyToSendFormControl.value;
    const currencyToGet = this.currencyToGetFormControl.value;

    if (!value || !currencyToSend || !currencyToGet) {
      return;
    }

    const valueToGet = await this.exchangeService.estimateQuickExchange(
      value,
      currencyToSend,
      currencyToGet
    );

    this.valueToGetFormControl.setValue(valueToGet);
  }
}
