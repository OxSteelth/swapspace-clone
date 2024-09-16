import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../models/currency';
import { SwapFormService } from '@app/shared/services/swap-form.service';

@Component({
  selector: 'app-asset-selector',
  templateUrl: './asset-selector.component.html',
  styleUrls: ['./asset-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetSelectorComponent implements OnChanges {
  public readonly amount = new FormControl<string>('');

  @Input() public inputMode: 'input' | 'output' | 'combined';

  @Input({ required: true }) label!: string;

  @Input() label2: string;

  @Input() asset: Currency;

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

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly currencyService: CurrencyService,
    private readonly swapFormService: SwapFormService
  ) {
    this.popularCurrencyList$ = this.currencyService.popularCurrencyList$;
    this.allCurrencyList$ = this.currencyService.allCurrencyList$;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoading']) {
      if (!this.spinner) return;

      this.spinner.nativeElement.style.display = changes['isLoading'].currentValue ? 'flex' : 'none';
    }
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
      this.amount.setValue(event.target.value.replace(/[^0-9.]/g, ''), { emitViewToModelChange: false });
      this.amountUpdated.emit(event.target.value);
    }
  }
}
