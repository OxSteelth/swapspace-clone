import { Injectable } from '@angular/core';
import { QueryParamsService } from '@core/services/query-params/query-params.service';
import { catchError, distinctUntilChanged, first, map, pairwise, switchMap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, forkJoin, from, Observable, of, scheduled } from 'rxjs';
import BigNumber from 'bignumber.js';
import { QueryParams } from '@core/services/query-params/models/query-params';
import { List } from 'immutable';
import { compareAddresses, compareObjects, switchIif } from '@shared/utils/utils';
import { CurrencyService } from '../currency.service';
import { SwapFormService } from '../swap-form.service';
import {
  defaultFormParameters,
  DefaultParametersFrom,
  DefaultParametersTo
} from './constants/default-tokens-params';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { Currency } from '@app/shared/models/currency';
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
          const findFromToken$ = this.getTokenBySymbol(
            tokens,
            protectedParams.from,
            fromBlockchain
          );
          const findToToken$ = this.getTokenBySymbol(tokens, protectedParams.to, toBlockchain);

          return forkJoin([findFromToken$, findToToken$]).pipe(
            map(([fromToken, toToken]) => ({
              fromToken,
              toToken,
              fromBlockchain,
              toBlockchain,
              amount: protectedParams.amount,
              amountTo: protectedParams.amountTo
            }))
          );
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
      newParams.fromChain = fromChain || defaultFormParameters.swap.fromChain;
      newParams.toChain = toChain || defaultFormParameters.swap.toChain;
      newParams.from = fromToken || defaultFormParameters.swap.from;
      newParams.to = toToken || defaultFormParameters.swap.to;
      newParams.amount = fromAmount || defaultFormParameters.swap.amount;
    });

    newParams = { ...newParams, ...queryParams };

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

  public getTokenBySymbol(tokens: Currency[], token: string, chain: string): Observable<Currency> {
    if (!token) {
      return of(null);
    }

    return this.searchTokenBySymbol(tokens, token, chain);
  }

  private searchTokenBySymbol(
    tokens: Currency[],
    symbol: string,
    chain: string
  ): Observable<Currency | null> {
    const similarTokens = tokens.filter(
      token => token.code.toLowerCase() === symbol.toLowerCase() && token.network === chain
    );

    if (similarTokens.length === 0) {
      return this.cacheService.allCurrencyList$.pipe(
        map(tokens => {
          if (tokens.length > 0) {
            const token =
              tokens.length > 1
                ? tokens.find(el => el.code.toLowerCase() === symbol.toLowerCase())
                : tokens[0];
            if (!token) {
              return null;
            }
            return token;
          }
          return null;
        })
      );
    }

    return of(similarTokens[0]);
  }
}
