import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CacheService } from '@app/shared/services/cache.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-process-card',
  templateUrl: './process-card.component.html',
  styleUrls: ['./process-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessCardComponent {
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
