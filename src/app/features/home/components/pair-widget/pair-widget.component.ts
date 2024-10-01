import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from '@app/shared/services/cache.service';
import { SwapFormService } from '@app/shared/services/swap-form.service';

@Component({
  selector: 'app-pair-widget',
  templateUrl: './pair-widget.component.html',
  styleUrls: ['./pair-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PairWidgetComponent {
  public readonly fromChain$ = this.swapFormService.fromBlockchain$;
  public readonly toChain$ = this.swapFormService.toBlockchain$;
  public readonly fromAsset$ = this.swapFormService.fromToken$;
  public readonly toAsset$ = this.swapFormService.toToken$;
  public readonly fromAmount$ = this.swapFormService.fromAmount$;
  public readonly toAmount$ = this.swapFormService.toAmount$;

  constructor(
    private readonly swapFormService: SwapFormService,
    private router: Router,
    private cacheService: CacheService
  ) {}

  navigateToUrl(url: string): void {
    this.router.navigate([url]);
  }

  viewOffers() {
    this.cacheService.updateExchangeStep(0);
    this.navigateToUrl('/exchange/step1');
  }
}
