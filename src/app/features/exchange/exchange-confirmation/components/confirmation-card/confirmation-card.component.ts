import { ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ExchangeConfirmationViewModel } from '../../viewmodel/exchange-confirmation.viewmodel.';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime, Observable, startWith, Subscription, tap } from 'rxjs';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';
import { SwapFormService } from '@app/shared/services/swap-form.service';
import { AvailableExchange, CreateExchange, CurrencyOption } from '@app/shared/types';
import { CurrencyService } from '@app/shared/services/currency.service';
import { StoreService } from '@app/shared/services/store/store.service';
import { WalletService } from '@app/shared/services/wallet.service';

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
    Validators.min(0)
  ]);

  public toAmountFormControl = new FormControl<number | null>(null, [Validators.min(0)]);

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

  exchangeRate$ = new BehaviorSubject<number | null>(22.6511428);
  echangeInfo = signal<AvailableExchange | undefined>(undefined);
  confirmationStep = signal(0);
  confirmed = signal(false);
  isShowingPanel = signal(false);

  public walletConnected: boolean = false;
  public walletId: string = '';

  @ViewChild('recipientPanel')
  recipientPanel!: ElementRef<HTMLDivElement>;

  constructor(
    // public exchangeConfirmation: ExchangeConfirmationViewModel,
    private route: ActivatedRoute,
    private exchangeService: ExchangeService,
    private swapFormService: SwapFormService,
    private currencyService: CurrencyService,
    private storeService: StoreService,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.checkWalletConnected();

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
      this.form.controls.toAmount.setValue(Number(v));
    });

    if (!this.exchangeService.selectedOffer) {
      this.exchangeService.updateSelectedOffer(this.storeService.getItem('SELECTED_OFFER'));
    }

    this.form.controls.recipientAddress.valueChanges.subscribe(value => {
      this.exchangeService.updateRecipientAddress(value);
    });
  }

  connectToWallet  = () => {
    this.walletService.connectWallet();
  }

  checkWalletConnected = async () => {
    const accounts = await this.walletService.checkWalletConnected();
    if(accounts.length > 0){
      this.walletConnected = true;
      this.walletId = accounts[0];
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
    const { toToken, fromAmount, fromToken, fromChain, toChain, recipientAddress, refundAddress } =
      this.form.value;
    const { id } = this.exchangeService.selectedOffer;

    if (!toToken || !fromAmount || !fromToken || !fromChain || !toChain || !recipientAddress) {
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
        refundAddress
      );

      res.subscribe(v => {
        if (v.id) {
          this.exchangeService.setConfirmationStep(1);
          this.exchangeService.stopInterval();
          this.swapFormService.disableInput();
          this.confirmed.set(true);
          this._depositAddress$.next(v.from.address);
        }
      });
    } catch (e) {
      console.error(e);
    }

    // this.watchConfirmation(confirmationId);
  }

  send(){

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

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

  async estimateExchange() {
    const value = this.fromAmountFormControl.value;
    const currencyToSend = this.fromTokenFormControl.value;
    const currencyToGet = this.toTokenFormControl.value;
    const exchangeId = this.echangeInfo()?.id;

    if (!exchangeId) {
      throw new Error('Exchange not set');
    }

    if (!value || !currencyToSend || !currencyToGet) {
      return;
    }

    const valueToGet = await this.exchangeService.calculateExchangeRate(
      currencyToSend,
      currencyToGet,
      value,
      exchangeId
    );

    this.toAmountFormControl.setValue(valueToGet);
  }

  showDetails() {
    this.isShowingPanel.set(!this.isShowingPanel());

    if (!this.recipientPanel) return;

    this.recipientPanel.nativeElement.style.maxHeight = this.isShowingPanel() ? '100px' : '0px';
  }
}
