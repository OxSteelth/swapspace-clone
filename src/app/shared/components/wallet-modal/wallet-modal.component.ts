import { Component, OnInit, OnDestroy } from '@angular/core';
import { CacheService } from '@app/shared/services/cache.service';
import { WalletService } from '@app/shared/services/wallet.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-wallet-modal',
  templateUrl: './wallet-modal.component.html',
  styleUrls: ['./wallet-modal.component.scss']
})
export class WalletModalComponent implements OnInit, OnDestroy {
  private _isOpen$ = new BehaviorSubject<boolean>(false);
  public isOpen$ = this._isOpen$.asObservable();

  openModal(): void {
    this._isOpen$.next(true);
  }

  closeModal(): void {
    this._isOpen$.next(false);
  }

  constructor(private walletService: WalletService, private cacheService: CacheService) {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  async connectMetamask() {
    const accounts = await this.walletService.checkWalletConnected();

    if (accounts.length > 0) {
      this.cacheService.updateIsWalletConnected(true);
      this.cacheService.updatewalletId(accounts[0])
    }

    this.closeModal();
  }
}
