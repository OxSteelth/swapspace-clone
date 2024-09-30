import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CacheService } from '@app/shared/services/cache.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-exchange-process-panel',
  templateUrl: './process-panel.component.html',
  styleUrls: ['./process-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeProcessPanelComponent {
  public readonly fromAsset$ = this.cacheService.fromToken$;
  public readonly fromAmount$ = this.cacheService.fromAmount$;
  public readonly toAsset$ = this.cacheService.toToken$;
  public readonly toAmount$ = this.cacheService.toAmount$;
  public assetsExist$: Observable<boolean>;

  private _exchangeRate$ = new BehaviorSubject<number>(0);
  public exchangeRate$ = this._exchangeRate$.asObservable();

  public updateExchangeRate(rate: number) {
    this._exchangeRate$.next(rate);
  }

  constructor(private cacheService: CacheService) {}

  ngOnInit() {
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
