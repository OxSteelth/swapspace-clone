import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Exchange } from '@app/shared/models/exchange';
import { CurrencyService } from '@app/shared/services/currency.service';
import { ExchangeService } from '@app/shared/services/exchange.service';
import { SwapFormService } from '@app/shared/services/swap-form.service';
import { compareObjects } from '@app/shared/utils/utils';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap
} from 'rxjs';

@Component({
  selector: 'app-exchange-list',
  templateUrl: './exchange-list.component.html',
  styleUrls: ['./exchange-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeListComponent {}
