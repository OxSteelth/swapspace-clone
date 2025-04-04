import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../models/currency';
import { SwapFormService } from '@app/shared/services/swap-form.service';
import { CacheService } from '@app/shared/services/cache.service';

@Component({
  selector: 'app-asset-selector',
  templateUrl: './asset-selector.component.html',
  styleUrls: ['./asset-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetSelectorComponent implements OnChanges, OnInit {
  public readonly amount = new FormControl<string>('');

  @Input() public inputMode: 'input' | 'output' | 'combined';

  @Input({ required: true }) label!: string;

  @Input() label2: string;

  @Input() asset: Currency;

  @Input() min: number;

  @Input() max: number;

  @Input() set amountValue(value: string | null) {
    if (this.inputMode !== 'input') {
      this.amount.setValue(value);
    }
  }

  @Input() isLoading: boolean;

  @Output() public amountUpdated = new EventEmitter<string>();
  @Output() public tokenClickedEvent = new EventEmitter<string>();

  public searching = signal(false);

  @ViewChild('assetSearchWrapper')
  assetSearchWrapper!: ElementRef<HTMLDivElement>;

  @ViewChild('spinner')
  spinner!: ElementRef<HTMLDivElement>;

  public readonly popularCurrencyList$: Observable<Currency[]>;

  public readonly allCurrencyList$: Observable<Currency[]>;

  private _amount$ = new BehaviorSubject<number>(0);
  public amount$ = this._amount$.asObservable();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly currencyService: CurrencyService,
    private readonly swapFormService: SwapFormService,
    private cacheService: CacheService
  ) {
    this.popularCurrencyList$ = this.cacheService.popularCurrencyList$;
    this.allCurrencyList$ = this.cacheService.allCurrencyList$;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoading']) {
      if (!this.spinner) return;

      // this.swapFormService.outputControl.patchValue({ toAmount: null });
      this.spinner.nativeElement.style.display = changes['isLoading'].currentValue
        ? 'flex'
        : 'none';
    }
  }

  ngOnInit(): void {
    this.cacheService.fromAmount$.subscribe(value => this._amount$.next(Number(value)));
  }

  public tokenClicked(label: string): void {
    this.tokenClickedEvent.emit(label);
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

  public setLimit() {
    if (this.min !== undefined && this._amount$.getValue() < this.min) {
      this.amount.setValue(this.min.toString());
      this.amountUpdated.emit(this.min.toString());
    } else if (this.max !== undefined && this._amount$.getValue() > this.max) {
      this.amount.setValue(this.max.toString());
      this.amountUpdated.emit(this.max.toString());
    }
  }
}
