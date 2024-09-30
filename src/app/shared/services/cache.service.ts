import { Injectable } from '@angular/core';
import { StoreService } from './store/store.service';
import { BehaviorSubject, startWith } from 'rxjs';
import { Currency } from '../models/currency';
import { Exchange } from '../models/exchange';
import { CreateExchange } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private _fromToken$ = new BehaviorSubject<Currency | null>(null);
  public fromToken$ = this._fromToken$.asObservable();
  public updateFromToken(token: Currency) {
    this._fromToken$.next(token);
    this.storeService.setItem('FROM_TOKEN', token);
  }

  private _toToken$ = new BehaviorSubject<Currency | null>(null);
  public toToken$ = this._toToken$.asObservable();
  public updateToToken(token: Currency) {
    this._toToken$.next(token);
    this.storeService.setItem('TO_TOKEN', token);
  }

  private _fromChain$ = new BehaviorSubject<string>('');
  public fromChain$ = this._fromChain$.asObservable();
  public updateFromChain(chain: string) {
    this._fromChain$.next(chain);
    this.storeService.setItem('FROM_CHAIN', chain);
  }

  private _toChain$ = new BehaviorSubject<string>('');
  public toChain$ = this._toChain$.asObservable();
  public updateToChain(chain: string) {
    this._toChain$.next(chain);
    this.storeService.setItem('TO_CHAIN', chain);
  }

  private _fromAmount$ = new BehaviorSubject<string>('');
  public fromAmount$ = this._fromAmount$.asObservable();
  public updateFromAmount(amount: string) {
    this._fromAmount$.next(amount);
    this.storeService.setItem('FROM_AMOUNT', amount);
  }

  private _toAmount$ = new BehaviorSubject<string>('');
  public toAmount$ = this._toAmount$.asObservable();
  public updateToAmount(amount: string) {
    this._toAmount$.next(amount);
    this.storeService.setItem('TO_AMOUNT', amount);
  }

  private _allCurrencyList$ = new BehaviorSubject<Currency[]>([]);
  public allCurrencyList$ = this._allCurrencyList$.asObservable();
  public updateAllCurrencyList(list: Currency[]) {
    this._allCurrencyList$.next(list);
    this.storeService.setItem('ALL_CURRENCY_LIST', list);
  }

  private _popularCurrencyList$ = new BehaviorSubject<Currency[]>([]);
  public popularCurrencyList$ = this._popularCurrencyList$.asObservable();
  public updatePopularCurrencyList(list: Currency[]) {
    this._popularCurrencyList$.next(list);
    this.storeService.setItem('POPULAR_CURRENCY_LIST', list);
  }

  private _selectedOffer$ = new BehaviorSubject<Exchange | null>(null);
  public selectedOffer$ = this._selectedOffer$.asObservable();
  public updateSelectedOffer(ex: Exchange) {
    this._selectedOffer$.next(ex);
    this.storeService.setItem('SELECTED_OFFER', ex);
  }

  private _depositAddress$ = new BehaviorSubject<string>('');
  public depositAddress$ = this._depositAddress$.asObservable();
  public updateDepositAddress(address: string) {
    this._depositAddress$.next(address);
    this.storeService.setItem('DEPOSIT_ADDRESS', address);
  }

  private _createdExchange$ = new BehaviorSubject<CreateExchange | null>(null);
  public createdExchange$ = this._createdExchange$.asObservable();
  public updateCreatedExchange(ex: CreateExchange) {
    this._createdExchange$.next(ex);
    this.storeService.setItem('CREATED_EXCHANGE', ex);
  }

  private _exchangeStep$ = new BehaviorSubject<number>(0);
  public exchangeStep$ = this._exchangeStep$.asObservable();
  public updateExchangeStep(step: number) {
    this._exchangeStep$.next(step);
    this.storeService.setItem('EXCHANGE_STEP', step);
  }
  public get exchangeStep(): number {
    return this._exchangeStep$.getValue();
  }

  private _recipientAddress$ = new BehaviorSubject<string>('');
  public recipientAddress$ = this._recipientAddress$.asObservable();
  public updateRecipientAddress(address: string) {
    this._recipientAddress$.next(address);
    this.storeService.setItem('RECIPIENT_ADDRESS', address);
  }

  private _isFilterFixedRate$ = new BehaviorSubject<boolean>(true);
  public isFilterFixedRate$ = this._isFilterFixedRate$.asObservable();
  public updateIsFilterFixedRate(rate: boolean) {
    this._isFilterFixedRate$.next(rate);
    this.storeService.setItem('FILTER_FIXED_RATE', rate);
  }

  private _isFilterFloatingRate$ = new BehaviorSubject<boolean>(true);
  public isFilterFloatingRate$ = this._isFilterFloatingRate$.asObservable();
  public updateIsFilterFloatingRate(rate: boolean) {
    this._isFilterFloatingRate$.next(rate);
    this.storeService.setItem('FILTER_FLOATING_RATE', rate);
  }

  private _availableExchanges$ = new BehaviorSubject<Exchange[]>([]);
  public availableExchanges$ = this._availableExchanges$.asObservable();
  public updateAvailableExchanges(exchanges: Exchange[]) {
    this._availableExchanges$.next(exchanges);
    this.storeService.setItem('AVAILABLE_EXCHANGES', exchanges);
  }
  public get availableExchanges(): Exchange[] {
    return this._availableExchanges$.getValue();
  }

  private _filteredExchanges$ = new BehaviorSubject<Exchange[]>([]);
  public filteredExchanges$ = this._filteredExchanges$.asObservable();
  public updateFilteredExchanges(exchanges: Exchange[]) {
    this._filteredExchanges$.next(exchanges);
    this.storeService.setItem('FILTERED_EXCHANGES', exchanges);
  }
  public get filteredExchanges(): Exchange[] {
    return this._filteredExchanges$.getValue();
  }

  private _isWalletConnected$ = new BehaviorSubject<boolean>(false);
  public isWalletConnected$ = this._isWalletConnected$.asObservable();
  public updateIsWalletConnected(isConnected: boolean) {
    this._isWalletConnected$.next(isConnected);
  }
  public get isWalletConnected(): boolean {
    return this._isWalletConnected$.getValue();
  }

  private _walletId$ = new BehaviorSubject<string>('');
  public walletId$ = this._walletId$.asObservable();
  public updatewalletId(id: string) {
    this._walletId$.next(id);
  }
  public get walletId(): string {
    return this._walletId$.getValue();
  }

  constructor(private storeService: StoreService) {}

  public init() {
    if (this.storeService.getItem('FROM_TOKEN')) {
      this.updateFromToken(this.storeService.getItem('FROM_TOKEN'));
    }

    if (this.storeService.getItem('FROM_CHAIN')) {
      this.updateFromChain(this.storeService.getItem('FROM_CHAIN'));
    }

    if (this.storeService.getItem('FROM_AMOUNT')) {
      this.updateFromAmount(this.storeService.getItem('FROM_AMOUNT'));
    }

    if (this.storeService.getItem('TO_TOKEN')) {
      this.updateToToken(this.storeService.getItem('TO_TOKEN'));
    }

    if (this.storeService.getItem('TO_CHAIN')) {
      this.updateToChain(this.storeService.getItem('TO_CHAIN'));
    }

    if (this.storeService.getItem('TO_AMOUNT')) {
      this.updateToAmount(this.storeService.getItem('TO_AMOUNT'));
    }

    if (this.storeService.getItem('ALL_CURRENCY_LIST')) {
      this.updateAllCurrencyList(this.storeService.getItem('ALL_CURRENCY_LIST'));
    }

    if (this.storeService.getItem('POPULAR_CURRENCY_LIST')) {
      this.updatePopularCurrencyList(this.storeService.getItem('POPULAR_CURRENCY_LIST'));
    }

    if (this.storeService.getItem('SELECTED_OFFER')) {
      this.updateSelectedOffer(this.storeService.getItem('SELECTED_OFFER'));
    }

    if (this.storeService.getItem('DEPOSIT_ADDRESS')) {
      this.updateDepositAddress(this.storeService.getItem('DEPOSIT_ADDRESS'));
    }

    if (this.storeService.getItem('CREATED_EXCHANGE')) {
      this.updateCreatedExchange(this.storeService.getItem('CREATED_EXCHANGE'));
    }

    if (this.storeService.getItem('EXCHANGE_STEP')) {
      this.updateExchangeStep(this.storeService.getItem('EXCHANGE_STEP'));
    }

    if (this.storeService.getItem('RECIPIENT_ADDRESS')) {
      this.updateRecipientAddress(this.storeService.getItem('RECIPIENT_ADDRESS'));
    }

    if (this.storeService.getItem('FILTER_FIXED_RATE')) {
      this.updateIsFilterFixedRate(this.storeService.getItem('FILTER_FIXED_RATE'));
    }

    if (this.storeService.getItem('FILTER_FLOATING_RATE')) {
      this.updateIsFilterFloatingRate(this.storeService.getItem('FILTER_FLOATING_RATE'));
    }

    if (this.storeService.getItem('AVAILABLE_EXCHANGES')) {
      this.updateAvailableExchanges(this.storeService.getItem('AVAILABLE_EXCHANGES'));
    }

    if (this.storeService.getItem('FILTERED_EXCHANGES')) {
      this.updateFilteredExchanges(this.storeService.getItem('FILTERED_EXCHANGES'));
    }
  }
}
