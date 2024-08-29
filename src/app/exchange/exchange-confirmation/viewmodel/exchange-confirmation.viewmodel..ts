import { Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { ExchangeService } from 'src/app/shared/services/exchange.service';
import { AvailableExchange, CurrencyOption } from 'src/app/shared/types';

@Injectable()
export class ExchangeConfirmationViewModel {
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

  addressFormControl = new FormControl<string>('', [Validators.required]);

  form = new FormGroup({
    valueToSend: this.valueToSendFormControl,
    currencyToSend: this.currencyToSendFormControl,
    valueToGet: this.valueToGetFormControl,
    currencyToGet: this.currencyToGetFormControl,
    address: this.addressFormControl,
    acceptTerms: new FormControl<boolean>(true, [Validators.requiredTrue]),
  });

  currencyList$: Observable<CurrencyOption[]> =
    this.currencyService.currencyList$;

  exchangeRate$ = new BehaviorSubject<number | null>(22.6511428);
  echangeInfo = signal<AvailableExchange | undefined>(undefined);
  confirmationStep = signal(0);
  confirmed = signal(false);

  constructor(
    public currencyService: CurrencyService,
    public exchangeService: ExchangeService
  ) {}

  async setExchange(exchangeId: string) {
    const exchange = await this.exchangeService.getExchangeInfo(exchangeId);
    this.echangeInfo.set(exchange);
  }

  async confirm() {
    const { currencyToGet, valueToSend, currencyToSend } = this.form.value;
    const { id } = this.echangeInfo()!;

    if (!currencyToGet || !valueToSend || !currencyToSend || !id) {
      throw new Error('Invalid form values');
    }

    const { confirmationId } = await this.exchangeService.confirmExchange(
      valueToSend,
      currencyToSend,
      currencyToGet,
      id
    );

    this.watchConfirmation(confirmationId);
  }

  watchConfirmation(confirmationId: string) {
    this.confirmed.set(true);

    this.exchangeService.watchConfirmation(confirmationId).subscribe((data) => {
      console.log(data);

      switch (data) {
        case 'awaiting payment':
          this.confirmationStep.set(1);
          break;
        case 'payment received':
          this.confirmationStep.set(2);
          break;
        default:
          this.confirmationStep.set(3);
      }
    });
  }

  async estimateExchange() {
    const value = this.valueToSendFormControl.value;
    const currencyToSend = this.currencyToSendFormControl.value;
    const currencyToGet = this.currencyToGetFormControl.value;
    const exchangeId = this.echangeInfo()?.id;

    if (!exchangeId) {
      throw new Error('Exchange not set');
    }

    if (!value || !currencyToSend || !currencyToGet) {
      return;
    }

    const valueToGet = await this.exchangeService.calculateExchangeRate(
      currencyToSend,
      currencyToGet,
      value,
      exchangeId
    );

    this.valueToGetFormControl.setValue(valueToGet);
  }
}
