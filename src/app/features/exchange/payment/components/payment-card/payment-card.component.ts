import { ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  Observable,
  startWith,
  Subscription,
  tap
} from 'rxjs';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';
import { SwapFormService } from '@app/shared/services/swap-form.service';
import { AvailableExchange, CreateExchange, CurrencyOption } from '@app/shared/types';
import { CurrencyService } from '@app/shared/services/currency.service';
import { StoreService } from '@app/shared/services/store/store.service';
import { WalletService } from '@app/shared/services/wallet.service';
import { Exchange } from '@app/shared/models/exchange';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentCardComponent {
  termsOfUseControl = new FormControl<boolean>(true);
  isEstimatingExchange = signal(false);

  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this._isLoading$.asObservable();

  private readonly _depositAddress$ = new BehaviorSubject<string>('');
  public readonly depositAddress$ = this._depositAddress$.asObservable();

  public updateDepositAddress(address: string) {
    this._depositAddress$.next(address);
  }

  public readonly fromAsset$ = this.swapFormService.fromToken$;
  public readonly fromAmount$ = this.swapFormService.fromAmount$;
  public readonly toAsset$ = this.swapFormService.toToken$;
  public readonly toAmount$ = this.swapFormService.toAmount$;

  public swapDirection = '';
  public recipientAddress$ = this.exchangeService.recipientAddress$;

  isCollapsed = true;

  @ViewChild('arrow')
  arrow!: ElementRef<HTMLDivElement>;

  currencyList$: Observable<CurrencyOption[]> = this.currencyService.currencyList$;

  private _createdExchange$ = new BehaviorSubject<CreateExchange | null>(null);
  public createdExchange$ = this._createdExchange$.asObservable();

  public updateCreatedExchange(ex: CreateExchange) {
    this._createdExchange$.next(ex);
  }

  private _exchangeRate$ = new BehaviorSubject<number>(0);
  public exchangeRate$ = this._exchangeRate$.asObservable();

  public updateExchangeRate(rate: number) {
    this._exchangeRate$.next(rate);
  }

  private readonly _exchangeInfo$ = new BehaviorSubject<Exchange | null>(null);
  public exchangeInfo$ = this._exchangeInfo$.asObservable();

  public updateExchangeInfo(info: Exchange) {
    this._exchangeInfo$.next(info);
  }

  confirmationStep = signal(0);
  confirmed = signal(false);
  isShowingPanel = signal(false);

  public walletConnected: boolean = false;
  public walletId: string = '';

  public assetsExist$: Observable<boolean>;

  @ViewChild('recipientPanel')
  recipientPanel!: ElementRef<HTMLDivElement>;

  constructor(
    private exchangeService: ExchangeService,
    private swapFormService: SwapFormService,
    private currencyService: CurrencyService,
    private walletService: WalletService,
    private storeService: StoreService,
    private swapFormQueryService: SwapFormQueryService
  ) {}

  ngOnInit() {
    this.swapFormService.disableInput();

    if (this.storeService.getItem('CREATED_EXCHANGE')) {
      this.updateCreatedExchange(this.storeService.getItem('CREATED_EXCHANGE'));
    }

    if (!this.exchangeService.selectedOffer) {
      this.exchangeService.updateSelectedOffer(this.storeService.getItem('SELECTED_OFFER'));
    }

    this.createdExchange$.subscribe(ce => {
      if (ce) {
        this.updateDepositAddress(ce.from.address);
        this.exchangeService.updateRecipientAddress(ce.to.address);

        const findFromToken$ = this.swapFormQueryService.getTokenBySymbol(
          this.currencyService.allCurrencyList,
          ce.from.code,
          ce.from.network
        );
        const findToToken$ = this.swapFormQueryService.getTokenBySymbol(
          this.currencyService.allCurrencyList,
          ce.to.code,
          ce.to.network
        );

        forkJoin([findFromToken$, findToToken$])
          .pipe(
            map(([fromToken, toToken]) => {
              this.swapFormService.inputControl.setValue({
                fromBlockchain: ce.from.network,
                fromToken,
                fromAmount: ce.from.amount.toString(),
                toBlockchain: ce.to.network,
                toToken
              });
            })
          )
          .subscribe();
      }
    });

    this.checkWalletConnected();

    if (this.arrow) {
      this.arrow.nativeElement.style.transform = this.isCollapsed
        ? 'rotate(180deg)'
        : 'rotate(0deg)';
    }

    this.exchangeService.selectedOffer$.pipe(distinctUntilChanged()).subscribe(offer => {
      console.log(offer);
      this.updateExchangeInfo(offer);
    });

    this.exchangeInfo$.subscribe(info => {
      if (info) {
        this.updateExchangeRate(info.toAmount / info.fromAmount);
      }
    });

    this.assetsExist$ = combineLatest([this.fromAsset$, this.toAsset$]).pipe(
      map(([from, to]) => !!from && !!to)
    );
  }

  connectToWallet = () => {
    this.walletService.connectWallet();
  };

  checkWalletConnected = async () => {
    const accounts = await this.walletService.checkWalletConnected();
    if (accounts.length > 0) {
      this.walletConnected = true;
      this.walletId = accounts[0];
    }
  };

  send() {}

  ngOnDestroy() {}

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
}
