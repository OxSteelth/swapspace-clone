import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CacheService } from '@app/shared/services/cache.service';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-exchange-finished-status',
  templateUrl: './exchange-finished-status.component.html',
  styleUrls: ['./exchange-finished-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeFinishedStatusComponent implements OnInit {
  public readonly fromAsset$ = this.cacheService.fromToken$;
  public readonly fromAmount$ = this.cacheService.fromAmount$;
  public readonly toAsset$ = this.cacheService.toToken$;
  public readonly toAmount$ = this.cacheService.toAmount$;
  public readonly fromChain$ = this.cacheService.fromChain$;
  public readonly toChain$ = this.cacheService.toChain$;
  public assetsExist$: Observable<boolean>;

  private _exchangeRate$ = new BehaviorSubject<number>(0);
  public exchangeRate$ = this._exchangeRate$.asObservable();

  public exchangeStatus$ = this.cacheService.exchangeStatus$;

  public updateExchangeRate(rate: number) {
    this._exchangeRate$.next(rate);
  }

  constructor(private cacheService: CacheService, private exchangeService: ExchangeService) {}

  ngOnInit(): void {
    this.assetsExist$ = combineLatest([this.fromAsset$, this.toAsset$]).pipe(
      map(([from, to]) => !!from && !!to)
    );

    this.cacheService.selectedOffer$.subscribe(info => {
      if (info) {
        this.updateExchangeRate(info.toAmount / info.fromAmount);
      }
    });
  }
}
