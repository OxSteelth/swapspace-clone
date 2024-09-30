import { Injectable } from '@angular/core';
import { QueryParamsService } from '@core/services/query-params/query-params.service';
import { catchError, distinctUntilChanged, first, map, pairwise, switchMap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, forkJoin, from, Observable, of, scheduled } from 'rxjs';
import { QueryParams } from '@core/services/query-params/models/query-params';
import { CurrencyService } from '../currency.service';
import { SwapFormService } from '../swap-form.service';
import { defaultFormParameters } from './constants/default-tokens-params';
import { CacheService } from '../cache.service';

@Injectable()
export class SwapFormQueryService {
  private readonly _initialLoading$ = new BehaviorSubject<boolean>(true);
  public readonly initialLoading$ = this._initialLoading$.asObservable();

  public get initialLoading(): boolean {
    return this._initialLoading$.getValue();
  }

  constructor(
    private readonly queryParamsService: QueryParamsService,
    private readonly swapFormService: SwapFormService,
    private readonly currencyService: CurrencyService,
    private cacheService: CacheService
  ) {}

  public subscribeOnQueryParams(): void {
    this.cacheService.allCurrencyList$
      .pipe(
        switchMap(tokens => {
          const queryParams = this.queryParamsService.queryParams;
          const protectedParams = this.getProtectedSwapParams(queryParams);
          const fromBlockchain = protectedParams.fromChain;
          const toBlockchain = protectedParams.toChain;
          const fromToken = this.currencyService.searchTokenBySymbol(
            tokens,
            protectedParams.from,
            fromBlockchain
          );
          const toToken = this.currencyService.searchTokenBySymbol(
            tokens,
            protectedParams.to,
            toBlockchain
          );

          return of({
            fromToken,
            toToken,
            fromBlockchain,
            toBlockchain,
            amount: protectedParams.amount,
            amountTo: protectedParams.amountTo
          });
        })
      )
      .subscribe(({ fromBlockchain, toToken, fromToken, toBlockchain, amount }) => {
        this.swapFormService.inputControl.patchValue({
          fromBlockchain,
          toBlockchain,
          ...(fromToken && { fromToken }),
          ...(toToken && { toToken }),
          ...(amount && {
            fromAmount: amount
          })
        });

        this._initialLoading$.next(false);
      });
  }

  public subscribeOnStep2QueryParams() {
    this.subscribeOnQueryParams();
    this.cacheService.selectedOffer$.subscribe(offer => {
      if (offer) {
        this.queryParamsService.patchQueryParams({
          partner: offer.partner,
          fixed: offer.fixed
        });
      }
    });
  }

  public subscribeOnStep34QueryParams() {
    this.cacheService.createdExchange$.subscribe(ce => {
      if (ce) {
        this.queryParamsService.freshQueryParams({
          id: ce.id
        });
      }
    });
  }

  private getProtectedSwapParams(queryParams: QueryParams): QueryParams {
    let newParams = {
      fromChain: '',
      toChain: '',
      from: '',
      to: '',
      amount: ''
    };

    combineLatest([
      this.cacheService.fromToken$,
      this.cacheService.fromChain$,
      this.cacheService.fromAmount$,
      this.cacheService.toChain$,
      this.cacheService.toToken$
    ]).subscribe(([fromToken, fromChain, fromAmount, toChain, toToken]) => {
      newParams.fromChain =
        queryParams?.fromChain || fromChain || defaultFormParameters.swap.fromChain;
      newParams.toChain = queryParams?.toChain || toChain || defaultFormParameters.swap.toChain;
      newParams.from = queryParams?.from || fromToken?.code || defaultFormParameters.swap.from;
      newParams.to = queryParams?.to || toToken?.code || defaultFormParameters.swap.to;
      newParams.amount = queryParams?.amount || fromAmount || defaultFormParameters.swap.amount;
    });

    if (
      newParams.fromChain === newParams.toChain &&
      newParams.from &&
      newParams.from === newParams.to
    ) {
      if (newParams.from === defaultFormParameters.swap.from) {
        newParams.from = defaultFormParameters.swap.to;
      } else {
        newParams.to = defaultFormParameters.swap.from;
      }
    }

    return newParams;
  }
}
