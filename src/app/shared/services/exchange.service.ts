import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  delay,
  firstValueFrom,
  interval,
  map,
  of,
  startWith,
  Subscription,
  switchMap,
  take,
  timer
} from 'rxjs';
import { AvailableExchange, CreateExchange } from '../types';
import { HttpService } from '@app/core/services/http/http.service';
import { Exchange, EXCHANGE_STATUS } from '../models/exchange';

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
  private readonly _status$ = new BehaviorSubject<EXCHANGE_STATUS>('CONFIRM');
  public status$ = this._status$.asObservable();

  public get status() {
    return this._status$.getValue();
  }

  private readonly _confirmationStep$ = new BehaviorSubject<number>(0);
  public confirmationStep$ = this._confirmationStep$.asObservable();

  public setConfirmationStep(value: number) {
    this._confirmationStep$.next(value);
  }

  public get confirmationStep() {
    return this._confirmationStep$.getValue()
  }

  private readonly _estimatedExchange$ = new BehaviorSubject<Exchange[]>([]);
  public readonly estimatedExchange$ = this._estimatedExchange$.asObservable();

  public get estimatedExchange(): Exchange[] {
    return this._estimatedExchange$.getValue();
  }

  private readonly _selectedOffer$ = new BehaviorSubject<Exchange>(null);
  public readonly selectedOffer$ = this._selectedOffer$.asObservable();

  public get selectedOffer(): Exchange {
    return this._selectedOffer$.getValue();
  }

  private readonly _recipientAddress$ = new BehaviorSubject<string>('');
  public readonly recipientAddress$ = this._recipientAddress$.asObservable();

  private readonly _fixedRate$ = new BehaviorSubject<boolean>(true);
  public readonly fixedRate$ = this._fixedRate$.asObservable();

  public get fixedRate(): boolean {
    return this._fixedRate$.getValue();
  }

  private readonly _floatingRate$ = new BehaviorSubject<boolean>(true);
  public readonly floatingRate$ = this._floatingRate$.asObservable();

  private intervalSubscription: Subscription | null = null;
  private _interval$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public interval$ = this._interval$.asObservable();

  constructor(private readonly httpService: HttpService) {}

  startInterval() {
    if (!this.intervalSubscription) {
      this.intervalSubscription = interval(30000)
        .pipe(startWith(0))
        .subscribe(val => {
          this._interval$.next(val);
        });
    }
  }

  // Stop the interval by unsubscribing
  stopInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
      this.intervalSubscription = null;
    }
  }

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

  confirmExchange(
    fromAmount: number,
    fromToken: string,
    fromChain: string,
    toToken: string,
    toChain: string,
    address: string,
    refundAddress: string
  ) {
    return this.httpService
      .post<CreateExchange>('exchange', {
        partner: this.selectedOffer.partner,
        fromCurrency: fromToken,
        fromNetwork: fromChain,
        toCurrency: toToken,
        toNetwork: toChain,
        address,
        amount: fromAmount,
        fixed: this.selectedOffer.fixed,
        refund: refundAddress
      })
      .pipe(
        catchError(error => {
          console.error('Error fetching data', error);
          return of(null);
        })
      );
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

  updateSelectedOffer(offer: Exchange) {
    this._selectedOffer$.next(offer);
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

  sortExchanges(field: string) {
    this._estimatedExchange$.next(
      this.estimatedExchange.sort((a, b) => {
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
  }

  updateRecipientAddress(addr: string) {
    this._recipientAddress$.next(addr);
  }
}
