import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { ExchangeService } from 'src/app/shared/services/exchange.service';
import { AvailableExchange, CurrencyOption } from 'src/app/shared/types';

@Injectable()
export class ExchangeListViewModel {
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

  currencyToGetFormControl = new FormControl<string>('USD', [
    Validators.required,
  ]);

  form = new FormGroup({
    valueToSend: this.valueToSendFormControl,
    currencyToSend: this.currencyToSendFormControl,
    valueToGet: this.valueToGetFormControl,
    currencyToGet: this.currencyToGetFormControl,
  });

  currencyList$ = this.currencyService.currencyList$;

  availableExchanges$ = this.exchangeService.getAvailableExchanges();

  constructor(
    public currencyService: CurrencyService,
    public exchangeService: ExchangeService
  ) {}
}
