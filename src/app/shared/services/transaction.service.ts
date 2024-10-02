import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, delay, of, shareReplay } from 'rxjs';
import { HttpService } from '@app/core/services/http/http.service';
import { RecentTrade, Trade } from '@shared/models/trade';

const now = Date.now();

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private _recentTrades$: BehaviorSubject<RecentTrade[]> = new BehaviorSubject<RecentTrade[]>([]);
  public recentTraces$ = this._recentTrades$.asObservable();

  allTransactions$ = of([
    {
      id: 1,
      date: now,
      amount: 10,
      fromCurrency: 'USDT',
      toCurrency: 'BTC',
    },
    {
      id: 2,
      date: now - 1000,
      amount: 20,
      fromCurrency: 'USD',
      toCurrency: 'USDT',
    },
    {
      id: 3,
      date: now - 2000 * 60,
      amount: 30,
      fromCurrency: 'BTC',
      toCurrency: 'ETH',
    },
    {
      id: 4,
      date: now - 3000 * 60,
      amount: 40,
      fromCurrency: 'USDT',
      toCurrency: 'BTC',
    },
    {
      id: 5,
      date: now - 4000 * 60,
      amount: 50,
      fromCurrency: 'USDT',
      toCurrency: 'BTC',
    },
    {
      id: 6,
      date: now - 5000 * 60,
      amount: 60,
      fromCurrency: 'USDT',
      toCurrency: 'BTC',
    },
    {
      id: 7,
      date: now - 6000 * 60,
      amount: 70,
      fromCurrency: 'USDT',
      toCurrency: 'BTC',
    },
    {
      id: 8,
      date: now - 7000 * 60,
      amount: 80,
      fromCurrency: 'USDT',
      toCurrency: 'BTC',
    },
    {
      id: 9,
      date: now - 8000 * 60,
      amount: 90,
      fromCurrency: 'USDT',
      toCurrency: 'BTC',
    },
    {
      id: 10,
      date: now - 9000 * 60,
      amount: 100,
      fromCurrency: 'USDT',
      toCurrency: 'BTC',
    },
  ]).pipe(delay(3000), shareReplay(1));

  constructor(private readonly httpService: HttpService) {
    this.fetchRecentTrades().subscribe((trades: Trade[]) => {
      this._recentTrades$.next(trades.map((trade => {
        return {
          date: Date.parse(trade.timestamp),
          amount: trade.from_amount,
          fromCurrency: trade.from_token.symbol,
          toCurrency: trade.to_token.symbol,
        }
      })))
    });
  }

  public fetchRecentTrades(): Observable<Trade[]> {
    return this.httpService
      .get<Trade[]>(`recent_trades`)
      .pipe(
        catchError(error => {
          console.error('Error fetching data', error);
          return of([] as Trade[]);
        })
      );
  }
}
