import { ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  from,
  map,
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
import {
  AvailableExchange,
  CreateExchange,
  CurrencyOption,
  ExchangeStatus,
  Transaction
} from '@app/shared/types';
import { CurrencyService } from '@app/shared/services/currency.service';
import { StoreService } from '@app/shared/services/store/store.service';
import { WalletService } from '@app/shared/services/wallet.service';
import { Exchange } from '@app/shared/models/exchange';
import { Web3Service } from '@app/shared/services/web3.service';
import { CacheService } from '@app/shared/services/cache.service';
import { Currency } from '@app/shared/models/currency';
import { WalletModalComponent } from '@app/shared/components/wallet-modal/wallet-modal.component';

@Component({
  selector: 'app-payment-panel',
  templateUrl: './payment-panel.component.html',
  styleUrls: ['./payment-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentPanelComponent {
  termsOfUseControl = new FormControl<boolean>(true);
  isEstimatingExchange = signal(false);

  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this._isLoading$.asObservable();

  private readonly _depositAddress$ = new BehaviorSubject<string>('');
  public readonly depositAddress$ = this._depositAddress$.asObservable();

  public updateDepositAddress(address: string) {
    this._depositAddress$.next(address);
  }

  public readonly fromAsset$ = this.cacheService.fromToken$;
  public readonly fromAmount$ = this.cacheService.fromAmount$;
  public readonly toAsset$ = this.cacheService.toToken$;
  public readonly toAmount$ = this.cacheService.toAmount$;

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

  public isWalletConnected$ = this.cacheService.isWalletConnected$;
  public isNetworkSelected: boolean = false;
  public networkId: string = '';
  public walletId$ = this.cacheService.walletId$;

  public assetsExist$: Observable<boolean>;

  @ViewChild('recipientPanel')
  recipientPanel!: ElementRef<HTMLDivElement>;

  @ViewChild('modal') walletModal: WalletModalComponent;

  accounts$: Observable<string[]>;
  balance$: Observable<string> | undefined;

  constructor(
    private exchangeService: ExchangeService,
    private currencyService: CurrencyService,
    private web3Service: Web3Service,
    private cacheService: CacheService,
    private clipboard: Clipboard,
    private router: Router
  ) {
    this.accounts$ = this.web3Service.getAccountsObservable();
  }

  ngOnInit() {
    this.cacheService.createdExchange$.subscribe(ce => {
      if (ce) {
        this.updateDepositAddress(this.web3Service.getChecksumAddress(ce.from.address));
        this.updateCreatedExchange(ce);

        const chainId = this.web3Service.getChainIdFromNetwork(ce.from.network);

        if (chainId) {
          this.networkId = chainId;
        }

        this.exchangeService.startCheckExchangeStatusInterval();
      }
    });

    this.exchangeService.checkExchangeStatusInterval$
      .pipe(
        switchMap(() => {
          if (this.cacheService.createdExchange?.id) {
            return this.exchangeService.checkExchangeStatus(this.cacheService.createdExchange.id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe((status: ExchangeStatus) => {
        this.cacheService.updateExchangeStatus(status);

        if (status?.status === 'confirming') {
          this.cacheService.updateExchangeStep(3);

          this.router.navigate(['/exchange/step4'], {
            queryParams: {
              id: this.cacheService.createdExchange.id
            }
          });
        }
      });

    this.checkNetworkConnected();

    if (this.arrow) {
      this.arrow.nativeElement.style.transform = this.isCollapsed
        ? 'rotate(180deg)'
        : 'rotate(0deg)';
    }

    this.exchangeService.selectedOffer$.pipe(distinctUntilChanged()).subscribe(offer => {
      this.updateExchangeInfo(offer);
    });

    this.cacheService.selectedOffer$.subscribe(info => {
      if (info) {
        this.updateExchangeRate(info.toAmount / info.fromAmount);
      }
    });

    this.assetsExist$ = combineLatest([this.fromAsset$, this.toAsset$]).pipe(
      map(([from, to]) => !!from && !!to)
    );

    this.accounts$.subscribe(accounts => {
      if (accounts.length > 0) {
        this.getBalance(accounts[0]);
      }
    });
  }

  getBalance(account: string): void {
    this.balance$ = this.web3Service.getBalance(account);
  }

  connectToWallet = () => {
    this.walletModal.openModal();

    // this.walletService.connectWallet();
  };

  checkNetworkConnected() {
    this.web3Service.currentNetwork$.subscribe(chainId => {
      if (chainId === this.networkId) {
        this.isNetworkSelected = true;
      } else {
        this.isNetworkSelected = false;
      }
    });
  }

  switchNetwork() {
    this.web3Service.switchNetwork(this.networkId).subscribe(() => {
      this.isNetworkSelected = true;
    });
  }

  send(): void {
    if (
      this.cacheService.walletId &&
      this._depositAddress$.getValue() &&
      this._createdExchange$.getValue().from.amount.toString()
    ) {
      if (this.web3Service.isZeroAddress(this._createdExchange$.getValue().from.contractAddress)) {
        this.web3Service
          .sendTransaction(
            this.cacheService.walletId,
            this._depositAddress$.getValue(),
            this._createdExchange$.getValue().from.amount.toString()
          )
          .subscribe({
            next: (data: Transaction) => {
              console.log(data);
            },
            error: err => {
              console.error('Error occurred:', err);
            }
          });
      } else {
        this.web3Service
          .sendTokenTransaction(
            this.cacheService.walletId,
            this._depositAddress$.getValue(),
            this._createdExchange$.getValue().from.amount.toString(),
            this._createdExchange$.getValue().from.contractAddress
          )
          .subscribe({
            next: data => {
              console.log(data);
            },
            error: err => {
              console.error('Error occurred:', err);
            }
          });
      }
    }
  }

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

  copyDepositAddress() {
    of(this._depositAddress$.getValue())
      .pipe(
        tap(textToCopy => this.clipboard.copy(textToCopy)),
        tap(() => console.log('Copied to clipboard:', this._depositAddress$.getValue()))
      )
      .subscribe();
  }
}
