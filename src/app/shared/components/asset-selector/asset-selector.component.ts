import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../models/currency';

@Component({
  selector: 'app-asset-selector',
  templateUrl: './asset-selector.component.html',
  styleUrls: ['./asset-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetSelectorComponent {
  public readonly amount = new FormControl<string>('');

  @Input() public inputMode: 'input' | 'output' | 'combined';

  @Input({ required: true }) label!: string;

  @Input() asset: Currency;

  @Input() set amountValue(value: string | null) {
    if (this.inputMode !== 'input') {
      this.amount.setValue(value);
    }
  }

  @Output() public amountUpdated = new EventEmitter<string>();

  public searching = signal(false);

  @ViewChild('assetSearchWrapper')
  assetSearchWrapper!: ElementRef<HTMLDivElement>;

  public readonly popularCurrencyList$: Observable<Currency[]>;

  public readonly allCurrencyList$: Observable<Currency[]>;

  constructor(private readonly cdr: ChangeDetectorRef, private readonly currencyService: CurrencyService) {
    this.popularCurrencyList$ = this.currencyService.popularCurrencyList$;
    this.allCurrencyList$ = this.currencyService.allCurrencyList$;
  }

  public toggleSelection(value?: boolean) {
    const newValue = value ?? !this.searching();

    this.searching.set(newValue);

    if (!this.assetSearchWrapper) return;

    const input = this.assetSearchWrapper.nativeElement.querySelector('input') as HTMLInputElement;

    this.assetSearchWrapper.nativeElement.style.display = this.searching() ? 'block' : 'none';

    input.focus();
  }

  public handleAmountChange(event: any): void {console.log(event.target.value)
    if (this.inputMode !== 'output') {
      this.amount.setValue(event.target.value, { emitViewToModelChange: false });
      this.amountUpdated.emit(event.target.value);
    }
  }
}
