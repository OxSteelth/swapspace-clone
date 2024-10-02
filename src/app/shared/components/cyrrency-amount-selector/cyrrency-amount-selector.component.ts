import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  delay,
  distinctUntilChanged,
  interval,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap
} from 'rxjs';
import { CurrencyOption } from '../../types';
import { Currency } from '@app/shared/models/currency';
import { CurrencyService } from '@app/shared/services/currency.service';
import { SwapFormService } from '@app/shared/services/swap-form.service';
import { compareObjects } from '@app/shared/utils/utils';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { Exchange } from '@app/shared/models/exchange';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';
import { CacheService } from '@app/shared/services/cache.service';

interface Token {
  token: Currency;
  group: string;
}

interface GroupedToken {
  group: string;
  tokens: Token[];
}

@Component({
  selector: 'app-cyrrency-amount-selector',
  templateUrl: './cyrrency-amount-selector.component.html',
  styleUrls: ['./cyrrency-amount-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CyrrencyAmountSelectorComponent implements OnChanges, OnInit {
  public readonly amount = new FormControl<string>('');

  @Input() public inputMode: 'input' | 'output' | 'combined';

  @Input() amountControl = new FormControl<number | null>(null);

  @Input({ required: true }) label!: string;

  @Input() label2: string;

  @Input() asset: Currency;

  @Input() isLoading: boolean;

  @Input() set amountValue(value: string | null) {
    if (this.inputMode !== 'input') {
      this.amount.setValue(value);
    }
  }

  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this._isLoading$.asObservable();

  @Output() public amountUpdated = new EventEmitter<string>();

  public searching = signal(false);

  @ViewChild('assetSearchWrapper')
  assetSearchWrapper!: ElementRef<HTMLDivElement>;

  @ViewChild('spinner')
  spinner!: ElementRef<HTMLDivElement>;

  public readonly popularCurrencyList$: Observable<Currency[]>;

  public readonly allCurrencyList$: Observable<Currency[]>;

  public searchInputControl: FormControl = new FormControl('');

  private readonly _filteredList$ = new BehaviorSubject<{ label: string; token: Currency }[]>([]);
  public readonly filteredList$ = this._filteredList$.asObservable();

  public get filteredList() {
    return this._filteredList$.getValue();
  }

  public swapDirection = '';

  private readonly _isDisabled$ = new BehaviorSubject<boolean>(false);
  public isDisabled$ = this._isDisabled$.asObservable();

  constructor(
    private readonly currencyService: CurrencyService,
    private readonly swapFormService: SwapFormService,
    private readonly swapFormQueryService: SwapFormQueryService,
    private readonly exchangeService: ExchangeService,
    private readonly cacheService: CacheService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoading']) {
      if (!this.spinner) return;

      this.spinner.nativeElement.style.display = changes['isLoading'].currentValue
        ? 'flex'
        : 'none';
    }
  }

  ngOnInit(): void {
    this.swapFormQueryService.subscribeOnQueryParams();
    this.exchangeService.confirmationStep$.subscribe(step => {
      if (step >= 1) {
        this._isDisabled$.next(true);
      }
    });

    this.isLoading$.subscribe(isLoading => {
      if (this.spinner) {
        this.spinner.nativeElement.style.display =
          this.inputMode === 'output' && isLoading ? 'flex' : 'none';
      }
    });

    combineLatest([
      this.cacheService.allCurrencyList$,
      this.cacheService.popularCurrencyList$
    ]).subscribe(([all, popular]) => {
      let tokens: { label: string; token: Currency }[] = [];
      popular.map((token, i) => {
        if (i === 0) tokens.push({ label: 'Popular Currencies', token });
        else tokens.push({ label: '', token });
      });
      all.map((token, i) => {
        if (i === 0) tokens.push({ label: 'All Currencies', token });
        else tokens.push({ label: '', token });
      });
      this._filteredList$.next(tokens);
    });

    combineLatest([
      this.cacheService.allCurrencyList$,
      this.cacheService.popularCurrencyList$,
      this.searchInputControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith('')
      )
    ])
      .pipe(
        map(([all, popular, searchValue]) => {
          return [
            all.filter(
              token =>
                token.code.toLowerCase().includes(searchValue.toLowerCase()) ||
                token.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                token.network.toLowerCase().includes(searchValue.toLowerCase()) ||
                token.networkName.toLowerCase().includes(searchValue.toLowerCase())
            ),
            popular.filter(
              token =>
                token.code.toLowerCase().includes(searchValue.toLowerCase()) ||
                token.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                token.network.toLowerCase().includes(searchValue.toLowerCase()) ||
                token.networkName.toLowerCase().includes(searchValue.toLowerCase())
            )
          ];
        })
      )
      .subscribe(([filteredAll, filteredPopular]) => {
        let tokens: { label: string; token: Currency }[] = [];
        filteredPopular.map((token, i) => {
          if (i === 0) tokens.push({ label: 'Popular Currencies', token });
          else tokens.push({ label: '', token });
        });
        filteredAll.map((token, i) => {
          if (i === 0) tokens.push({ label: 'All Currencies', token });
          else tokens.push({ label: '', token });
        });
        this._filteredList$.next(tokens);
      });

    this.swapFormService.inputControl.valueChanges.pipe(startWith(null));

    combineLatest([
      this.exchangeService.interval$,
      this.swapFormService.inputControl.valueChanges.pipe(
        startWith(this.swapFormService.inputValue),
        debounceTime(300),
        distinctUntilChanged((prevInput, currInput) => compareObjects(prevInput, currInput))
      ),
      this.cacheService.selectedOffer$
    ])
      .pipe(
        switchMap(([, value, selectedOffer]) => {
          this._isLoading$.next(true);
          if (
            value.fromBlockchain !== '' &&
            value.toBlockchain !== '' &&
            value.fromToken &&
            value.toToken &&
            value.fromAmount &&
            selectedOffer
          ) {
            return this.exchangeService.getEstimatedExchangeAmounts({
              fromCurrency: value.fromToken.code,
              fromNetwork: value.fromBlockchain,
              toNetwork: value.toBlockchain,
              toCurrency: value.toToken.code,
              amount: value.fromAmount,
              partner: selectedOffer.partner,
              fixed: selectedOffer.fixed.toString()
            });
          } else {
            return of([]);
          }
        })
      )
      .subscribe((value: Exchange[]) => {
        if (value.length > 0) {
          this.swapFormService.outputControl.patchValue({
            toAmount: value[0].toAmount.toString()
          });
        } else {
          this.swapFormService.outputControl.patchValue({
            toAmount: '0'
          });
        }
        this._isLoading$.next(false);
      });

    this.swapFormService.inputControl.statusChanges.subscribe(_status => {
      if (_status === 'DISABLED') {
        this._isDisabled$.next(true);
      }
    });
  }

  public tokenClicked(label: string): void {
    this.swapDirection = label.toLowerCase();
    this.searching.set(!this.searching());

    if (!this.assetSearchWrapper) return;

    const input = this.assetSearchWrapper.nativeElement.querySelector('input') as HTMLInputElement;

    this.assetSearchWrapper.nativeElement.style.display = this.searching() ? 'flex' : 'none';

    input.focus();
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

    this.assetSearchWrapper.nativeElement.style.display = 'none';
  }

  public toggleSelection(value?: boolean) {
    const newValue = value ?? !this.searching();

    this.searching.set(newValue);

    if (!this.assetSearchWrapper) return;

    const input = this.assetSearchWrapper.nativeElement.querySelector('input') as HTMLInputElement;

    this.assetSearchWrapper.nativeElement.style.display = this.searching() ? 'block' : 'none';

    input.focus();
  }

  public handleAmountChange(event: any): void {
    if (this.inputMode !== 'output') {
      this.amount.setValue(event.target.value.replace(/[^0-9.]/g, ''), {
        emitViewToModelChange: false
      });
      this.amountUpdated.emit(event.target.value);
    }
  }
}
