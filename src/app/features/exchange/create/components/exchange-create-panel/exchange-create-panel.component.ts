import { ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  startWith,
  Subscription,
  switchMap,
  tap
} from 'rxjs';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';
import { SwapFormService } from '@app/shared/services/swap-form.service';
import { AvailableExchange, CreateExchange, CurrencyOption } from '@app/shared/types';
import { CurrencyService } from '@app/shared/services/currency.service';
import { StoreService } from '@app/shared/services/store/store.service';
import { compareObjects } from '@app/shared/utils/utils';
import { Exchange } from '@app/shared/models/exchange';
import { CacheService } from '@app/shared/services/cache.service';

@Component({
  selector: 'app-exchange-create-panel',
  templateUrl: './exchange-create-panel.component.html',
  styleUrls: ['./exchange-create-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeCreatePanelComponent {
  termsOfUseControl = new FormControl<boolean>(true);
  isEstimatingExchange = signal(false);
  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this._isLoading$.asObservable();

  private readonly _depositAddress$ = new BehaviorSubject<string>('');
  public readonly depositAddress$ = this._depositAddress$.asObservable();

  public readonly fromAsset$ = this.swapFormService.fromToken$;
  public readonly fromAmount$ = this.swapFormService.fromAmount$;
  public readonly toAsset$ = this.swapFormService.toToken$;
  public readonly toAmount$ = this.swapFormService.toAmount$;

  public fromTokenFormControl = new FormControl<string>('BTC', [Validators.required]);
  public fromChainFormControl = new FormControl<string>('BTC', [Validators.required]);
  public fromAmountFormControl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(this.cacheService.selectedOffer?.min || 0),
    this.cacheService.selectedOffer?.max && Validators.max(this.cacheService.selectedOffer?.max)
  ]);

  public toAmountFormControl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0)
  ]);

  public toTokenFormControl = new FormControl<string>('ETH', [Validators.required]);
  public toChainFormControl = new FormControl<string>('ETH', [Validators.required]);
  public recipientAddressFormControl = new FormControl<string>('', [Validators.required]);
  public refundAddressFormControl = new FormControl<string>('');
  public emailFormControl = new FormControl<string>('');
  public acceptTermsFormControl = new FormControl<boolean>(true, [Validators.requiredTrue]);
  public swapDirection = '';
  public recipientAddress$ = this.exchangeService.recipientAddress$;

  form = new FormGroup({
    fromToken: this.fromTokenFormControl,
    fromChain: this.fromChainFormControl,
    fromAmount: this.fromAmountFormControl,
    toToken: this.toTokenFormControl,
    toChain: this.toChainFormControl,
    toAmount: this.toAmountFormControl,
    recipientAddress: this.recipientAddressFormControl,
    acceptTerms: this.acceptTermsFormControl,
    refundAddress: this.refundAddressFormControl,
    email: this.emailFormControl
  });

  isCollapsed = true;

  @ViewChild('arrow')
  arrow!: ElementRef<HTMLDivElement>;

  currencyList$: Observable<CurrencyOption[]> = this.currencyService.currencyList$;

  private _exchangeRate$ = new BehaviorSubject<number>(0);
  public exchangeRate$ = this._exchangeRate$.asObservable();
  public updateExchangeRate(rate: number) {
    this._exchangeRate$.next(rate);
  }
  echangeInfo = signal<AvailableExchange | undefined>(undefined);
  confirmationStep = signal(0);
  confirmed = signal(false);
  isShowingPanel = signal(false);

  @ViewChild('recipientPanel')
  recipientPanel!: ElementRef<HTMLDivElement>;

  constructor(
    // public exchangeConfirmation: ExchangeConfirmationViewModel,
    private route: ActivatedRoute,
    private router: Router,
    private exchangeService: ExchangeService,
    private swapFormService: SwapFormService,
    private currencyService: CurrencyService,
    private storeService: StoreService,
    private cacheService: CacheService
  ) {}

  ngOnInit() {
    if (this.arrow) {
      this.arrow.nativeElement.style.transform = this.isCollapsed
        ? 'rotate(180deg)'
        : 'rotate(0deg)';
    }

    this.swapFormService.inputControl.valueChanges.subscribe(v => {
      this.form.controls.fromAmount.setValue(Number(v.fromAmount));
      this.form.controls.fromToken.setValue(v.fromToken?.code);
      this.form.controls.fromChain.setValue(v.fromBlockchain);
      this.form.controls.toChain.setValue(v.toBlockchain);
      this.form.controls.toToken.setValue(v.toToken?.code);
    });

    this.swapFormService.outputControl.valueChanges.subscribe(v => {
      this.form.controls.toAmount.setValue(Number(v.toAmount));
    });

    combineLatest([
      this.form.controls.fromAmount.valueChanges,
      this.form.controls.toAmount.valueChanges
    ]).subscribe(([from, to]) => {
      this.updateExchangeRate(to / from);
    });

    if (!this.exchangeService.selectedOffer) {
      this.exchangeService.updateSelectedOffer(this.storeService.getItem('SELECTED_OFFER'));
    }

    this.form.controls.recipientAddress.valueChanges.subscribe(value => {
      this.exchangeService.updateRecipientAddress(value);
      this.cacheService.updateRecipientAddress(value);
    });
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
    const {
      toToken,
      fromAmount,
      fromToken,
      fromChain,
      toChain,
      recipientAddress,
      refundAddress,
      toAmount
    } = this.form.value;

    if (
      !toToken ||
      !fromAmount ||
      !fromToken ||
      !fromChain ||
      !toChain ||
      !recipientAddress ||
      !toAmount
    ) {
      throw new Error('Invalid form values');
    }

    try {
      const res = this.exchangeService.confirmExchange(
        fromAmount,
        fromToken,
        fromChain,
        toToken,
        toChain,
        recipientAddress,
        refundAddress,
        toAmount.toString()
      );

      res.subscribe(ce => {
        if (ce) {
          this.exchangeService.setConfirmationStep(1);
          this.exchangeService.stopInterval();
          this.swapFormService.disableInput();
          this.confirmed.set(true);
          this.cacheService.updateCreatedExchange(ce);
          this.cacheService.updateExchangeStep(2);

          this.router.navigate(['/exchange/step3'], {
            queryParams: {
              id: ce.id
            }
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  ngOnDestroy() {}

  async setExchange(exchangeId: string) {
    const exchange = await this.exchangeService.getExchangeInfo(exchangeId);
    this.echangeInfo.set(exchange);
  }

  watchConfirmation(confirmationId: string) {
    this.confirmed.set(true);

    this.exchangeService.watchConfirmation(confirmationId).subscribe(data => {
      switch (data) {
        case 'awaiting payment':
          this.confirmationStep.set(1);
          break;
        case 'payment received':
          this.confirmationStep.set(2);
          break;
        default:
          this.confirmationStep.set(3);
      }
    });
  }

  showDetails() {
    this.isShowingPanel.set(!this.isShowingPanel());

    if (!this.recipientPanel) return;

    this.recipientPanel.nativeElement.style.maxHeight = this.isShowingPanel() ? '100px' : '0px';
  }

  onPaste() {
    navigator.clipboard
      .readText()
      .then(text => {
        this.form.controls.recipientAddress.setValue(text);
      })
      .catch(err => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }
}
