import { Injectable } from '@angular/core';
import { of } from 'rxjs';

const now = Date.now();

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
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
      fromCurrency: 'USDT',
      toCurrency: 'BTC',
    },
    {
      id: 3,
      date: now - 2000 * 60,
      amount: 30,
      fromCurrency: 'USDT',
      toCurrency: 'BTC',
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
  ]);

  constructor() {}
}
