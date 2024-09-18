import { ExchangeService } from 'src/app/shared/services/exchange.service';
import { Component } from '@angular/core';
import { currencyIconMap } from 'src/app/shared/currency-icon-map';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ExchangeListViewModel } from '../../viewmodel/exchange-list-view-model.';
import { Router } from '@angular/router';

@Component({
  selector: 'app-available-exchange',
  templateUrl: './available-exchange.component.html',
  styleUrls: ['./available-exchange.component.scss']
})
export class AvailableExchangeComponent {
  sortOptions = ['Sort by relevance', 'Sort by rate', 'Sort by ETA'];

  constructor(public exchangeListViewModel: ExchangeListViewModel, private router: Router) {}

  skeletonArray = new Array(3);

  ngOnInit() {}

  getCurrencyIcon(currency: string): string {
    return currencyIconMap[currency as keyof typeof currencyIconMap];
  }

  onTabChange(event: any) {
    if (event === 0) {
      this.exchangeListViewModel.sortBy('relevance');
    } else if (event === 1) {
      this.exchangeListViewModel.sortBy('rate');
    } else {
      this.exchangeListViewModel.sortBy('eta');
    }
  }

  exchangeCurrency(exchange: string) {
    this.router.navigate(['/exchange/step2'], {
      queryParams: {
        from: this.exchangeListViewModel.currencyToGetFormControl.value,
        to: this.exchangeListViewModel.currencyToSendFormControl.value,
        amount: this.exchangeListViewModel.valueToSendFormControl.value,
        exchange
      }
    });
  }
}
