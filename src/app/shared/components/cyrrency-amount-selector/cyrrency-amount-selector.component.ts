import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, shareReplay, startWith } from 'rxjs';
import { CurrencyOption } from '../../types';

@Component({
  selector: 'app-cyrrency-amount-selector',
  templateUrl: './cyrrency-amount-selector.component.html',
  styleUrls: ['./cyrrency-amount-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CyrrencyAmountSelectorComponent {
  @Input() control = new FormControl<number | null>(null);
  @Input() currencyControl = new FormControl<string | null>(null);
  @Input() valueReadOnly = false;
  @Input() disabled = false;

  isSelectingCurrency = signal(false);
  currentCurrency$!: Observable<CurrencyOption | null>;

  @ViewChild('currencyInputWrapper')
  currencyInputWrapper!: ElementRef<HTMLDivElement>;

  @Input() currencyList: CurrencyOption[] | null = null;

  ngOnInit() {
    this.currentCurrency$ = this.currencyControl.valueChanges.pipe(
      startWith(this.currencyControl.value),
      map((currency) => {
        if (!currency) return null;
        return this.currencyList?.find((c) => c.value === currency) ?? null;
      }),
      shareReplay(1)
    );
  }

  toggleCurrencySelection(value?: boolean) {
    if (this.disabled) return;

    const newValue = value ?? !this.isSelectingCurrency();

    this.isSelectingCurrency.set(newValue);

    if (!this.currencyInputWrapper) return;

    const input = this.currencyInputWrapper.nativeElement.querySelector(
      'input'
    ) as HTMLInputElement;

    this.currencyInputWrapper.nativeElement.style.display =
      this.isSelectingCurrency() ? 'block' : 'none';

    input.focus();
  }

  readonly searchControl = new FormControl('');

  selectCurrency(currency: CurrencyOption) {
    this.currencyControl.setValue(currency.value);
    this.toggleCurrencySelection(false);
  }
}
