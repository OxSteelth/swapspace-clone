import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, first, map } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { WINDOW } from '@ng-web-apis/common';
import { QueryParams } from './core/services/query-params/models/query-params';
import { QueryParamsService } from './core/services/query-params/query-params.service';
import { CacheService } from './shared/services/cache.service';
import { CurrencyService } from './shared/services/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'swapspace-clone';

  constructor(
    private readonly queryParamsService: QueryParamsService,
    @Inject(WINDOW) private window: Window,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cacheService: CacheService,
    private currencyService: CurrencyService
  ) {
    this.cacheService.init();
    this.initQueryParamsSubscription().subscribe();
  }

  ngOnInit(): void {
    this.currencyService.fetchCurrencyList();
  }

  /**
   * Inits site query params subscription.
   */
  private initQueryParamsSubscription(): Observable<void> {
    const questionMarkIndex = this.window.location.href.indexOf('?');
    if (questionMarkIndex === -1 || questionMarkIndex === this.window.location.href.length - 1) {
      return of(null);
    }

    return this.activatedRoute.queryParams.pipe(
      first(queryParams => Boolean(Object.keys(queryParams).length)),
      map((queryParams: QueryParams) => {
        this.queryParamsService.setupQueryParams({
          ...queryParams
        });
      }),
      catchError(() => of(null))
    );
  }
}
