import { Injectable } from '@angular/core';
import { QueryParamsService } from '@core/services/query-params/query-params.service';
import { catchError, distinctUntilChanged, first, map, pairwise, switchMap } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
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
    private readonly currencyService: CurrencyService
  ) {}

  public subscribeOnSwapForm(): void {
    console.log("subscribeOnSwapForm")
    this.swapFormService.inputValue$
      .pipe(
        distinctUntilChanged((prev, curr) => compareObjects(prev, curr)),
        pairwise()
      )
      .subscribe(([prev, curr]) => {
        let isEqual = compareObjects(prev, curr);
        if (prev?.fromToken && curr?.fromToken) {
          const pricelessPrev = {
            ...prev,
            fromToken: {
              ...(prev.fromToken as Currency)
            },
            toToken: {
              ...prev.toToken
            }
          };

          const pricelessCurr = {
            ...curr,
            fromToken: {
              ...(curr.fromToken as Currency)
            },
            toToken: {
              ...curr.toToken
            }
          };

          isEqual = compareObjects(pricelessPrev, pricelessCurr);
        }

        console.log(curr)
        if (curr.fromToken && curr.toToken) {
          this.queryParamsService.patchQueryParams({
            ...(curr.fromToken?.code && { from: curr.fromToken.code }),
            ...(curr.toToken?.code && { to: curr.toToken.code }),
            ...(curr.fromBlockchain && { fromChain: curr.fromBlockchain }),
            ...(curr.toBlockchain && { toChain: curr.toBlockchain }),
            ...(Number(curr.fromAmount) > 0 && {
              amount: curr.fromAmount
            })
          });
        } else {
          this.queryParamsService.patchQueryParams({
            ...{ from: 'btc' },
            ...{ to: 'eth' },
            ...{ fromChain: 'btc' },
            ...{ toChain: 'eth' },
            ...{ amount: '0.1' }
          });
        }
      });
  }

  public subscribeOnQueryParams(): void {
    this.currencyService.allCurrencyList$.subscribe(v => console.log(v))
    this.currencyService.allCurrencyList$
      .pipe(
        switchMap(tokens => {
          console.log({tokens})
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

  private getProtectedSwapParams(queryParams: QueryParams): QueryParams {
    let fromChain: string = defaultFormParameters.swap.fromChain;

    const toChain = defaultFormParameters.swap.toChain;

    const newParams = {
      ...queryParams,
      fromChain,
      toChain
    };

    if (fromChain === toChain && newParams.from && newParams.from === newParams.to) {
      if (newParams.from === defaultFormParameters.swap.from) {
        newParams.from = defaultFormParameters.swap.to;
      } else {
        newParams.to = defaultFormParameters.swap.from;
      }
    }

    return newParams;
  }

  private getTokenBySymbol(tokens: Currency[], token: string, chain: string): Observable<Currency> {
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
      return this.currencyService.allCurrencyList$.pipe(
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
