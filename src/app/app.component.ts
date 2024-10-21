import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { catchError, first, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
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
  public appContentClass: string = '';
  public classes: { [key: string]: string } = {
    '': 'app__content_alt-bg-index app__content_alt-bg-step1',
    'exchange-listing': 'app__content_alt-bg-exchange-listing',
    'affiliate': 'app__content_alt-bg-affiliate',
    'how-it-works': 'app__content_alt-bg-hiw',
    'about': 'app__content_alt-bg-about'
  };

  constructor(
    private readonly queryParamsService: QueryParamsService,
    @Inject(WINDOW) private window: Window,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly cacheService: CacheService,
    private readonly currencyService: CurrencyService
  ) {
    this.cacheService.init();
    this.initQueryParamsSubscription().subscribe();
  }

  ngOnInit(): void {
    this.currencyService.fetchCurrencyList();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.appContentClass = this.classes[event.url.split('/')[1].split('?')[0]];
      }
    });
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
