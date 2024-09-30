import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged,
  firstValueFrom,
  interval,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subscription,
  switchMap,
  take,
  tap,
  timer
} from 'rxjs';
import { AvailableExchange, CreateExchange, ExchangeStatus } from '../types';
import { HttpService } from '@app/core/services/http/http.service';
import { Exchange } from '../models/exchange';
import { CacheService } from './cache.service';

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
  private readonly _confirmationStep$ = new BehaviorSubject<number>(0);
  public confirmationStep$ = this._confirmationStep$.asObservable();

  public setConfirmationStep(value: number) {
    this._confirmationStep$.next(value);
  }

  public get confirmationStep() {
    return this._confirmationStep$.getValue();
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

  public updateRecipientAddress(address: string) {
    this._recipientAddress$.next(address);
  }

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

  private checkExchangeStatusIntervalSubscription: Subscription | null = null;
  private _checkExchangeStatusInterval$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public checkExchangeStatusInterval$ = this._checkExchangeStatusInterval$.asObservable();

  constructor(private readonly httpService: HttpService, private cacheService: CacheService) {}

  startInterval() {
    if (!this.intervalSubscription) {
      this.intervalSubscription = interval(60000)
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

  startCheckExchangeStatusInterval() {
    if (!this.checkExchangeStatusIntervalSubscription) {
      this.checkExchangeStatusIntervalSubscription = interval(10000)
        .pipe(startWith(0))
        .subscribe(val => {
          this._checkExchangeStatusInterval$.next(val);
        });
    }
  }

  stopCheckExchangeStatusInterval() {
    if (this.checkExchangeStatusIntervalSubscription) {
      this.checkExchangeStatusIntervalSubscription.unsubscribe();
      this.checkExchangeStatusIntervalSubscription = null;
    }
  }

  addMultipleQueryParams(params: { [key: string]: string }) {
    let updatedParams = '';

    Object.keys(params).forEach(key => {
      const value = params[key];

      if (value) {
        if (!updatedParams) {
          updatedParams += `?${key}=${value}`;
        } else {
          updatedParams += `&${key}=${value}`;
        }
      }
    });

    return updatedParams;
  }

  getEstimatedExchangeAmounts(params: { [key: string]: string }) {
    const updatedUrl = this.addMultipleQueryParams(params);

    return this.httpService.get<Exchange[]>(`amounts${updatedUrl}`).pipe(
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
    refundAddress: string,
    toAmount: string
  ) {
    return this.httpService
      .post<CreateExchange>('exchange', {
        address,
        amount: fromAmount,
        analyticsClientId: '',
        direction: 'direct',
        duration: this.selectedOffer.duration,
        email: '',
        extraId: '',
        fixed: this.selectedOffer.fixed,
        fromCurrency: fromToken,
        fromNetwork: fromChain,
        languages: ['en-US'],
        partner: this.selectedOffer.partner,
        preExchangeAmount: toAmount,
        rateId: '',
        refund: refundAddress,
        refundExtraId: '',
        status: 'pre',
        timezone: '',
        toCurrency: toToken,
        toNetwork: toChain
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

  sortExchanges(field: string): Observable<Exchange[]> {
    return this.cacheService.filteredExchanges$.pipe(
      switchMap(exchanges => {
        return of(
          exchanges.sort((a, b) => {
            if (field === 'relevance') {
              return b.toAmount - a.toAmount;
            } else if (field === 'rate') {
              return b.toAmount - a.toAmount;
            } else if (field === 'eta') {
              const aEta = a.duration.split('-').reduce((result, v) => result + Number(v), 0);
              const bEta = b.duration.split('-').reduce((result, v) => result + Number(v), 0);
              return aEta - bEta;
            } else {
              return 1;
            }
          })
        );
      })
    );
  }

  getBestPartner(field: string): Observable<Exchange> {
    return this.cacheService.filteredExchanges$.pipe(
      switchMap(exchanges => {
        const sorted = exchanges.sort((a, b) => {
          if (field === 'relevance') {
            return b.toAmount - a.toAmount;
          } else if (field === 'rate') {
            return b.toAmount - a.toAmount;
          } else if (field === 'eta') {
            const aEta = a.duration
              .split('-')
              .reduce((result, v) => (v ? result + Number(v) : result * 2), 0);
            const bEta = b.duration
              .split('-')
              .reduce((result, v) => (v ? result + Number(v) : result * 2), 0);
            return aEta - bEta;
          } else {
            return 1;
          }
        });

        return of(sorted[0]);
      })
    );
  }

  checkExchangeStatus(id: string) {
    return this.httpService.get<ExchangeStatus>(`exchange/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching exchange status', error);
        return of(null);
      })
    );
  }
}
