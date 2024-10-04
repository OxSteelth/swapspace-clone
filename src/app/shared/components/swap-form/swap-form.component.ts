import { Component, ElementRef, signal, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';
import {
  map,
  Observable,
  debounceTime,
  distinctUntilChanged,
  startWith,
  combineLatest,
  switchMap,
  timeout,
  BehaviorSubject,
  of,
  forkJoin,
  withLatestFrom,
  interval
} from 'rxjs';
import { SwapFormService } from '@shared/services/swap-form.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../models/currency';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { Exchange } from '@app/shared/models/exchange';
import { compareObjects } from '@app/shared/utils/utils';
import { CacheService } from '@app/shared/services/cache.service';

@Component({
  selector: 'app-swap-form',
  templateUrl: './swap-form.component.html',
  styleUrls: ['./swap-form.component.scss']
})
export class SwapFormComponent implements OnInit, OnDestroy {
  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this._isLoading$.asObservable();

  private readonly _currencyList$ = new BehaviorSubject<Currency[]>([]);
  public readonly currencyList$ = this._currencyList$.asObservable();

  private readonly _filteredList$ = new BehaviorSubject<Currency[]>([]);
  public readonly filteredList$ = this._filteredList$.asObservable();

  public swapDirection = '';
  public label: string = '';
  public searching = signal(false);
  public selectedAction = 'all';
  public selectedMode = 'exchange';

  public inputControl: FormControl;

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  @ViewChild('assetSearchWrapper')
  assetSearchWrapper!: ElementRef<HTMLDivElement>;

  public readonly fromChain$ = this.swapFormService.fromBlockchain$;

  public readonly toChain$ = this.swapFormService.toBlockchain$;

  public readonly fromAsset$ = this.swapFormService.fromToken$;

  public readonly toAsset$ = this.swapFormService.toToken$;

  public readonly fromAmount$ = this.swapFormService.fromAmount$;

  public readonly toAmount$ = this.swapFormService.toAmount$;

  public readonly offer$ = this.cacheService.selectedOffer$;

  public popularCurrencyList$: Observable<Currency[]>;

  public allCurrencyList$: Observable<Currency[]>;

  constructor(
    private readonly swapFormService: SwapFormService,
    private readonly swapFormQueryService: SwapFormQueryService,
    private readonly currencyService: CurrencyService,
    public exchangeService: ExchangeService,
    private cacheService: CacheService
  ) {
    this.inputControl = new FormControl('');
  }

  ngOnInit() {
    this.exchangeService.startInterval();

    this.swapFormQueryService.subscribeOnQueryParams();

    this.popularCurrencyList$ = this.cacheService.popularCurrencyList$;
    this.allCurrencyList$ = this.cacheService.allCurrencyList$;
    this.allCurrencyList$.subscribe(value => {
      this._currencyList$.next(value);
      this._filteredList$.next(value);
    });

    combineLatest([
      this.currencyList$,
      this.inputControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), startWith(''))
    ])
      .pipe(
        map(([currencyList, searchValue]) => {
          return currencyList.filter(
            item =>
              item.code.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.network.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.networkName.toLowerCase().includes(searchValue.toLowerCase())
          );
        })
      )
      .subscribe(value => this._filteredList$.next(value));

    this.swapFormService.inputControl.valueChanges.pipe(startWith(null));

    combineLatest([
      this.exchangeService.interval$,
      this.swapFormService.inputControl.valueChanges.pipe(
        startWith(this.swapFormService.inputValue),
        debounceTime(300),
        distinctUntilChanged((prevInput, currInput) => compareObjects(prevInput, currInput))
      )
    ])
      .pipe(
        switchMap(([, value]) => {
          this._isLoading$.next(true);
          if (
            value.fromBlockchain !== '' &&
            value.toBlockchain !== '' &&
            value.fromToken &&
            value.toToken &&
            value.fromAmount
          ) {
            return this.exchangeService.getBestExchangeAmount(
              value.fromToken.code,
              value.fromBlockchain,
              value.toBlockchain,
              value.toToken.code,
              Number(value.fromAmount)
            );
          } else {
            return of(null);
          }
        })
      )
      .subscribe((value: Exchange) => {
        if (value) {
          this.swapFormService.outputControl.patchValue({
            toAmount: value.toAmount.toString()
          });
          if (this.cacheService.exchangeStep === 0) {
            this.cacheService.updateSelectedOffer(value);
          }
        } else {
          this.swapFormService.outputControl.patchValue({
            toAmount: '0'
          });
          if (this.cacheService.exchangeStep === 0) {
            this.cacheService.updateSelectedOffer(null);
          }
        }
        this._isLoading$.next(false);
      });
  }

  ngOnDestroy(): void {
    this.exchangeService.stopInterval();
  }

  public scrollToIndex(index: number): void {
    if (this.viewport) {
      this.viewport.scrollToIndex(index, 'smooth'); // Scrolls to the specified index
    }
  }

  public updateInputValue(value: string): void {
    const oldValue = this.swapFormService.inputValue?.fromAmount;

    if (!oldValue || oldValue !== value) {
      this.swapFormService.inputControl.patchValue({
        fromAmount: value ? value : null
      });
    }
  }

  public tokenClicked(value: string, direction: string): void {
    this.swapDirection = direction;
    this.searching.set(!this.searching());

    if (!this.assetSearchWrapper) return;

    const input = this.assetSearchWrapper.nativeElement.querySelector('input') as HTMLInputElement;

    this.assetSearchWrapper.nativeElement.style.display = this.searching() ? 'flex' : 'none';

    input.focus();

    this.label = value;
  }

  public selectToken(currency: Currency) {
    if (this.swapDirection === 'from') {
      this.swapFormService.inputControl.patchValue({
        fromBlockchain: currency.network,
        fromToken: currency
      });
    } else {
      this.swapFormService.inputControl.patchValue({
        toToken: currency,
        toBlockchain: currency.network
      });
    }

    this.closeSearch();
  }

  public closeSearch(): void {
    this.searching.set(!this.searching());

    if (!this.assetSearchWrapper) return;

    this.assetSearchWrapper.nativeElement.style.display = 'none';
  }

  public async revert(): Promise<void> {
    const { fromBlockchain, toBlockchain, fromToken, toToken } = this.swapFormService.inputValue;
    const { toAmount } = this.swapFormService.outputValue;

    this.swapFormService.inputControl.patchValue({
      fromBlockchain: toBlockchain,
      fromToken: toToken,
      toToken: fromToken,
      toBlockchain: fromBlockchain,
      ...(Number(toAmount) > 0 && {
        fromAmount: toAmount
      })
    });
    this.swapFormService.outputControl.patchValue({
      toAmount: null
    });
  }

  selectCategories(tabIndex: number) {
    this.selectedAction = tabIndex === 0 ? 'all' : 'popular';
    this.inputControl.setValue('');

    if (tabIndex === 0) {
      this.allCurrencyList$.subscribe(value => this._currencyList$.next(value));
    } else if (tabIndex === 1) {
      this.popularCurrencyList$.subscribe(value => this._currencyList$.next(value));
    }
  }

  selectModes(tabIndex: number) {
    this.selectedMode = tabIndex === 0 ? 'exchange' : 'buysell';

    if (tabIndex === 0) {
      // this.swapFormService.inputControl.patchValue({
      //   from
      // })
      // this.currencyList$ = this.allCurrencyList$;
    } else if (tabIndex === 1) {
      // this.currencyList$ = this.popularCurrencyList$;
    }
  }
}
