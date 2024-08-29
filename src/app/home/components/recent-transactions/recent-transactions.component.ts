import { Component } from '@angular/core';
import { currencyIconMap } from 'src/app/shared/currency-icon-map';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-recent-transactions',
  templateUrl: './recent-transactions.component.html',
  styleUrls: ['./recent-transactions.component.scss'],
})
export class RecentTransactionsComponent {
  skeletonArray = new Array(10);

  constructor(public transactionService: TransactionService) {}

  getCurrencyIcon(currency: string): string {
    return currencyIconMap[currency as keyof typeof currencyIconMap];
  }
}
