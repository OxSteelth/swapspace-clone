import { ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ExchangeConfirmationViewModel } from '../../viewmodel/exchange-confirmation.viewmodel.';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime, startWith, Subscription, tap } from 'rxjs';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';
import { SwapFormService } from '@app/shared/services/swap-form.service';

@Component({
  selector: 'app-confirmation-card',
  templateUrl: './confirmation-card.component.html',
  styleUrls: ['./confirmation-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationCardComponent {
  termsOfUseControl = new FormControl<boolean>(true);
  isEstimatingExchange = signal(false);
  sub!: Subscription;
  sub2!: Subscription;
  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this._isLoading$.asObservable();

  public readonly fromAsset$ = this.swapFormService.fromToken$;
  public readonly fromAmount$ = this.swapFormService.fromAmount$;
  public readonly toAsset$ = this.swapFormService.toToken$;
  public readonly toAmount$ = this.swapFormService.toAmount$;

  public fromTokenFormControl = new FormControl<string>('BTC', [Validators.required]);
  public fromAmountFormControl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0)
  ]);

  public toAmountFormControl = new FormControl<number | null>(null, [Validators.min(0)]);

  public toTokenFormControl = new FormControl<string>('ETH', [Validators.required]);

  public addressFormControl = new FormControl<string>('', [Validators.required]);
  public acceptTermsFormControl = new FormControl<boolean>(true, [Validators.requiredTrue]);
  public swapDirection = '';

  form = new FormGroup({
    fromToken: this.fromTokenFormControl,
    fromAmount: this.fromAmountFormControl,
    toToken: this.toTokenFormControl,
    toAmount: this.toAmountFormControl,
    address: this.addressFormControl,
    acceptTerms: this.acceptTermsFormControl
  });

  isCollapsed = true;

  @ViewChild('arrow')
  arrow!: ElementRef<HTMLDivElement>;

  constructor(
    public exchangeConfirmation: ExchangeConfirmationViewModel,
    private route: ActivatedRoute,
    private exchangeService: ExchangeService,
    private swapFormService: SwapFormService
  ) {}

  ngOnInit() {
    if (this.arrow) {
      this.arrow.nativeElement.style.transform = this.isCollapsed
        ? 'rotate(180deg)'
        : 'rotate(0deg)';
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

  onSubmit() {
    this.exchangeConfirmation.confirm();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }
}
