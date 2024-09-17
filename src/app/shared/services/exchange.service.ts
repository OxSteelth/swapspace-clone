import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  delay,
  firstValueFrom,
  map,
  of,
  switchMap,
  take,
  timer
} from 'rxjs';
import { AvailableExchange } from '../types';
import { HttpService } from '@app/core/services/http/http.service';
import { Exchange } from '../models/exchange';

const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  BTC: {
    USD: 10000,
    ETH: 10,
    ANY: 0.0001
  },
  USD: {
    BTC: 0.0001,
    ETH: 0.00001,
    ANY: 0.00000001
  },
  ETH: {
    USD: 100,
    BTC: 0.1,
    ANY: 0.0001
  }
};

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private readonly _estimatedExchange$ = new BehaviorSubject<Exchange[]>([]);
  public readonly estimatedExchange$ = this._estimatedExchange$.asObservable();

  private readonly _fixedRate$ = new BehaviorSubject<boolean>(true);
  public readonly fixedRate$ = this._fixedRate$.asObservable();

  private readonly _floatingRate$ = new BehaviorSubject<boolean>(true);
  public readonly floatingRate$ = this._floatingRate$.asObservable();

  constructor(private readonly httpService: HttpService) {}

  getEstimatedExchangeAmounts(
    fromCurrency: string,
    fromNetwork: string,
    toNetwork: string,
    toCurrency: string,
    fromAmount: number
  ) {
    return this.httpService
      .get<Exchange[]>(
        `amounts?fromCurrency=${fromCurrency}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}&toCurrency=${toCurrency}&amount=${fromAmount}`
      )
      .pipe(
        catchError(error => {
          console.error('Error fetching data', error);
          return of([] as Exchange[]);
        })
      );
  }

  getBestExchangeAmount(
    fromCurrency: string,
    fromNetwork: string,
    toNetwork: string,
    toCurrency: string,
    fromAmount: number
  ) {
    return this.httpService
      .get<Exchange>(
        `amounts/best?fromCurrency=${fromCurrency}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}&toCurrency=${toCurrency}&amount=${fromAmount}`
      )
      .pipe(
        catchError(error => {
          console.error('Error fetching data', error);
          return of(null);
        })
      );
  }

  updatedEstimatedExchange(value: Exchange[]) {
    this._estimatedExchange$.next(value);
  }

  getAvailableExchanges() {
    return of<AvailableExchange[]>([
      {
        id: 'binance',
        exchangeName: 'Binance',
        exchangeIconSrc: 'assets/exchange-icons/binance-icon.svg',
        rate: 0.0001,
        eta: {
          min: 1,
          max: 5
        },
        kycRisks: 'low',
        trustedPartner: true,
        giveaway: false
      },
      {
        id: 'changeHero',
        exchangeName: 'ChangeHero',
        exchangeIconSrc: 'assets/exchange-icons/change-hero.svg',
        rate: 0.0002,
        eta: {
          min: 1,
          max: 5
        },
        kycRisks: 'medium',
        trustedPartner: false,
        giveaway: false
      },
      {
        id: 'easyBit',
        exchangeName: 'EasyBit',
        exchangeIconSrc: 'assets/exchange-icons/easy-bit.svg',
        rate: 0.0003,
        eta: {
          min: 1,
          max: 5
        },
        kycRisks: 'high',
        trustedPartner: false,
        giveaway: true
      }
    ]).pipe(delay(1000));
  }

  estimateQuickExchange(valueToSend: number, from: string, to: string) {
    const rate = EXCHANGE_RATES[from][to] || EXCHANGE_RATES[from]['ANY'];

    return Promise.resolve(valueToSend * rate);
  }

  calculateExchangeRate(from: string, to: string, amount: number, echangeId: string) {
    const rate = EXCHANGE_RATES[from][to] || EXCHANGE_RATES[from]['ANY'];

    return Promise.resolve(amount * rate);
  }

  async getExchangeInfo(exchangeId: string) {
    const exchanges = await firstValueFrom(this.getAvailableExchanges());

    return exchanges.find(exchange => exchange.id === exchangeId);
  }

  updateFixedRate(value: boolean) {
    this._fixedRate$.next(value);
  }

  updateFloatingRate(value: boolean) {
    this._floatingRate$.next(value);
  }

  confirmExchange(valueToSend: number, from: string, to: string, exchangeId: string) {
    return Promise.resolve({
      confirmationId: '123'
    });
  }

  watchConfirmation(confirmationId: string) {
    return timer(1000, 1000).pipe(
      take(3),
      map(i => {
        switch (i) {
          case 0:
            return 'awaiting payment';
          case 1:
            return 'payment received';
          default:
            return 'exchange completed';
        }
      })
    );
  }
}
