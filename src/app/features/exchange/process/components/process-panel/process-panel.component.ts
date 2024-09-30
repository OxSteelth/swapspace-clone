import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CacheService } from '@app/shared/services/cache.service';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { ExchangeStatus } from '@app/shared/types';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap } from 'rxjs';

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

  private _isFinished$ = new BehaviorSubject<boolean>(false);
  public isFinished$ = this._isFinished$.asObservable();

  public updateIsFinished(isFinished: boolean) {
    this._isFinished$.next(isFinished);
  }

  public exchangeStatus$ = this.cacheService.exchangeStatus$;

  constructor(private cacheService: CacheService, private exchangeService: ExchangeService) {}

  ngOnInit() {
    this.assetsExist$ = combineLatest([this.fromAsset$, this.toAsset$]).pipe(
      map(([from, to]) => !!from && !!to)
    );

    this.cacheService.selectedOffer$.subscribe(info => {
      if (info) {
        this.updateExchangeRate(info.toAmount / info.fromAmount);
      }
    });

    this.exchangeService.checkExchangeStatusInterval$
      .pipe(
        switchMap(() => {
          if (this.cacheService.createdExchange.id) {
            return this.exchangeService.checkExchangeStatus(this.cacheService.createdExchange.id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe((status: ExchangeStatus) => {
        this.cacheService.updateExchangeStatus(status);

        if (status?.status === 'finished') {
          this.updateIsFinished(true);
          this.cacheService.updateExchangeStep(4);
          this.exchangeService.stopCheckExchangeStatusInterval();
        }
      });

      this.cacheService.exchangeStatus$.subscribe((status) => {
        if(status?.status === 'finished') {
          this.updateIsFinished(true);
          this.cacheService.updateExchangeStep(4);
          this.exchangeService.stopCheckExchangeStatusInterval();
        }
      })
  }
}
