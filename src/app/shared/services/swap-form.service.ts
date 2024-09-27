import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  SwapForm,
  SwapFormInput,
  SwapFormInputControl,
  SwapFormOutput,
  SwapFormOutputControl
} from '../models/swap-form-controls';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { compareTokens } from '../utils/utils';
import { shareReplayConfig } from '../constants/common/share-replay-config';
import { observableToBehaviorSubject } from '../utils/observableToBehaviorSubject';
import { Currency } from '../models/currency';
import { CacheService } from './cache.service';
import { QueryParamsService } from '@app/core/services/query-params/query-params.service';
import { CurrencyService } from './currency.service';

@Injectable()
export class SwapFormService {
  public readonly form = new FormGroup<SwapForm>({
    input: new FormGroup<SwapFormInputControl>({
      fromBlockchain: new FormControl(null),
      fromAmount: new FormControl(null),
      fromToken: new FormControl(null),
      toBlockchain: new FormControl(null),
      toToken: new FormControl(null)
    }),
    output: new FormGroup<SwapFormOutputControl>({
      toAmount: new FormControl(null)
    })
  });

  /**
   * Input control, used to patch value.
   */
  public readonly inputControl = this.form.controls.input;

  public get inputValue(): SwapFormInput {
    return this.form.get('input').value;
  }

  private readonly _inputValue$ = new BehaviorSubject<SwapFormInput>(this.inputValue);
  public readonly inputValue$ = this._inputValue$.asObservable();

  public readonly inputValueDistinct$ = this.inputValue$.pipe(
    distinctUntilChanged(
      (prev, next) =>
        prev.toBlockchain === next.toBlockchain &&
        prev.fromBlockchain === next.fromBlockchain &&
        compareTokens(prev.fromToken, next.fromToken) &&
        compareTokens(prev.toToken, next.toToken) &&
        prev.fromAmount === next.fromAmount
    ),
    shareReplay(shareReplayConfig)
  );

  public readonly fromBlockchain$: Observable<string | null> = this.inputValue$.pipe(
    map(inputValue => inputValue.fromBlockchain),
    distinctUntilChanged(),
    shareReplay(shareReplayConfig)
  );

  public readonly toBlockchain$: Observable<string> = this.inputValue$.pipe(
    map(inputValue => inputValue.toBlockchain),
    distinctUntilChanged(),
    shareReplay(shareReplayConfig)
  );

  public readonly fromToken$: Observable<Currency | null> = this.inputValue$.pipe(
    map(inputValue => inputValue.fromToken),
    distinctUntilChanged(),
    shareReplay(shareReplayConfig)
  );

  public readonly toToken$: Observable<Currency> = this.inputValue$.pipe(
    map(inputValue => inputValue.toToken),
    distinctUntilChanged(),
    shareReplay(shareReplayConfig)
  );

  public readonly fromAmount$: Observable<string> = this.inputValue$.pipe(
    map(inputValue => inputValue.fromAmount),
    distinctUntilChanged(),
    shareReplay(shareReplayConfig)
  );

  /**
   * Output control, used to patch value.
   */
  public readonly outputControl = this.form.controls.output;

  public get outputValue(): SwapFormOutput {
    return this.outputControl.getRawValue();
  }

  private readonly _outputValue$ = new BehaviorSubject<SwapFormOutput>(this.outputValue);

  public readonly outputValue$ = this._outputValue$.asObservable();

  public readonly outputValueDistinct$ = this.outputValue$.pipe(
    distinctUntilChanged(),
    shareReplay(shareReplayConfig)
  );

  public readonly toAmount$: Observable<string> = this.outputValue$.pipe(
    map(value => value.toAmount),
    distinctUntilChanged(),
    shareReplay(shareReplayConfig)
  );

  private readonly _isFilled$: BehaviorSubject<boolean> = observableToBehaviorSubject(
    this.inputValue$.pipe(
      map(form =>
        Boolean(
          form.fromBlockchain &&
            form.fromToken &&
            form.toBlockchain &&
            form.toToken &&
            Number(form.fromAmount) > 0
        )
      )
    ),
    false
  );

  public readonly isFilled$ = this._isFilled$.asObservable();

  public get isFilled(): boolean {
    return this._isFilled$.getValue();
  }

  constructor(private cacheService: CacheService, private queryParamsService: QueryParamsService, private currencyService: CurrencyService) {
    this.subscribeOnFormValueChange();
  }

  private subscribeOnFormValueChange(): void {
    this.form.get('input').valueChanges.subscribe(inputValue => {
      this._inputValue$.next(inputValue);
      this.cacheService.updateFromToken(inputValue.fromToken);
      this.cacheService.updateFromChain(inputValue.fromBlockchain);
      this.cacheService.updateFromAmount(inputValue.fromAmount);
      this.cacheService.updateToChain(inputValue.toBlockchain);
      this.cacheService.updateToToken(inputValue.toToken);
      this.queryParamsService.freshQueryParams({
        from: inputValue.fromToken.code,
        fromChain: inputValue.fromBlockchain,
        to: inputValue.toToken.code,
        toChain: inputValue.toBlockchain,
        amount: inputValue.fromAmount
      })
    });

    this.form.get('output').valueChanges.subscribe(outputValue => {
      this._outputValue$.next(outputValue);
      this.cacheService.updateToAmount(outputValue.toAmount);
    });
  }

  public disableInput(): void {
    this.form.controls.input.disable();
    this.form.controls.output.disable();
  }
}
