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

  private readonly _filteredList$ = new BehaviorSubject<{ name: string; tokens: Currency[] }[]>([]);
  public readonly filteredList$ = this._filteredList$.asObservable();

  public get filteredList() {
    return this._filteredList$.getValue();
  }

  public swapDirection = '';

  private _tokens$ = new BehaviorSubject<Token[]>([]);
  public tokens$ = this._tokens$.asObservable();

  public get tokens() {
    return this._tokens$.getValue();
  }

  private _filteredTokens$ = new BehaviorSubject<Token[]>([]);
  public filteredTokens$ = this._filteredTokens$.asObservable();

  public get filteredTokens() {
    return this._filteredTokens$.getValue();
  }

  private _groupedTokens$ = new BehaviorSubject<GroupedToken[]>([]);
  public groupedTokens$ = this._groupedTokens$.asObservable();

  private _loadedTokens$ = new BehaviorSubject<Token[]>([]);
  public loadedTokens$ = this._loadedTokens$.asObservable();

  public get loadedTokens() {
    return this._loadedTokens$.getValue();
  }

  itemsPerPage = 10;
  currentPage = 0;

  private readonly _isDisabled$ = new BehaviorSubject<boolean>(false);
  public isDisabled$ = this._isDisabled$.asObservable();

  constructor(
    private readonly currencyService: CurrencyService,
    private readonly swapFormService: SwapFormService,
    private readonly swapFormQueryService: SwapFormQueryService,
    private readonly exchangeService: ExchangeService,
    private readonly cacheService: CacheService
  ) {
    this.initializeData();
  }

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
      this._tokens$.next([
        ...popular.slice(0, 10).map(v => ({ group: 'Popular Currencies', token: v })),
        ...all.slice(0, 10).map(v => ({ group: 'All Currencies', token: v }))
      ]);
      this._filteredTokens$.next([
        ...popular.slice(0, 10).map(v => ({ group: 'Popular Currencies', token: v })),
        ...all.slice(0, 10).map(v => ({ group: 'All Currencies', token: v }))
      ]);
    });

    combineLatest([
      this.tokens$,
      this.searchInputControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith('')
      )
    ])
      .pipe(
        map(([tokens, searchValue]) => {
          return tokens.filter(
            token =>
              token.token.code.toLowerCase().includes(searchValue.toLowerCase()) ||
              token.token.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              token.token.network.toLowerCase().includes(searchValue.toLowerCase()) ||
              token.token.networkName.toLowerCase().includes(searchValue.toLowerCase())
          );
        })
      )
      .subscribe(value => this._filteredTokens$.next(value));

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
            return this.exchangeService.getEstimatedExchangeAmounts(
              value.fromToken.code,
              value.fromBlockchain,
              value.toBlockchain,
              value.toToken.code,
              value.fromAmount,
              selectedOffer.partner,
              selectedOffer.fixed.toString()
            );
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

    this.loadMoreData();

    this.swapFormService.inputControl.statusChanges.subscribe(_status => {
      if (_status === 'DISABLED') {
        this._isDisabled$.next(true);
      }
    });
  }

  initializeData(): void {
    this.filteredTokens$.subscribe(tokens => {
      const grouped = tokens.reduce((res, token) => {
        const group = res.find(r => r.group === token.group);

        if (group) {
          group.tokens.push(token);
        } else {
          res.push({ group: token.group, tokens: [token] });
        }

        return res;
      }, [] as GroupedToken[]);

      this._groupedTokens$.next(grouped);
    });
  }

  loadMoreData(): void {
    const nextPage = this.tokens.slice(
      this.currentPage * this.itemsPerPage,
      (this.currentPage + 1) * this.itemsPerPage
    );
    this._loadedTokens$.next([...this.loadedTokens, ...nextPage]);
    this.currentPage++;
  }

  onScroll(): void {
    if (this.currentPage * this.itemsPerPage < this.tokens.length) {
      this.loadMoreData();
    }
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
