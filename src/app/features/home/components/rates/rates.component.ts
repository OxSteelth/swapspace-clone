import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from '@app/shared/services/cache.service';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatesComponent {
  constructor(private router: Router, private cacheService: CacheService) {}

  navigateToUrl(url: string): void {
    this.router.navigate([url]);
  }

  viewOffers() {
    this.cacheService.updateExchangeStep(0);
    this.navigateToUrl('/exchange/step1')
  }

  quickExchange() {
    this.cacheService.updateExchangeStep(1);
    this.cacheService.updateCreatedExchange(null);
    this.navigateToUrl('/exchange/step2')
  }
}
