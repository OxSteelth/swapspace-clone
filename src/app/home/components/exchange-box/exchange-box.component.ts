import { CurrencyService } from './../../../shared/services/currency.service';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, delay, of, Subscription, take, tap } from 'rxjs';
import { CurrencyOption } from 'src/app/shared/types';
import { HomeExchangeViewModel } from '../../viewmodels/home-exchange.viewmodel';

@Component({
  selector: 'app-exchange-box',
  templateUrl: './exchange-box.component.html',
  styleUrls: ['./exchange-box.component.scss'],
  providers: [HomeExchangeViewModel],
})
export class ExchangeBoxComponent {
  sub!: Subscription;
  isEstimatingExchange = signal(false);
  selectedAction = 'exchange';

  constructor(
    private router: Router,
    public homeExchangeViewModel: HomeExchangeViewModel
  ) {}

  ngOnInit() {
    this.sub = this.homeExchangeViewModel.form.valueChanges
      .pipe(
        tap(() => {
          this.isEstimatingExchange.set(true);
        }),
        debounceTime(500),
        tap(async () => {
          await this.homeExchangeViewModel.estimateExchange();
          this.isEstimatingExchange.set(false);
        })
      )
      .subscribe();
  }

  onTabChange(tabIndex: number) {
    this.selectedAction = tabIndex === 0 ? 'exchange' : 'sell';

    if (tabIndex === 0) {
      this.homeExchangeViewModel.currencyToSendFormControl.setValue('BTC');
      this.homeExchangeViewModel.currencyToGetFormControl.setValue('ETH');
    } else if (tabIndex === 1) {
      this.homeExchangeViewModel.currencyToSendFormControl.setValue('USD');
      this.homeExchangeViewModel.currencyToGetFormControl.setValue('BTC');
    }
  }

  onSubmit(): void {
    if (this.homeExchangeViewModel.form.valid) {
      this.router.navigate(['/exchange'], {
        queryParams: {
          from: this.homeExchangeViewModel.currencyToSendFormControl.value,
          to: this.homeExchangeViewModel.currencyToGetFormControl.value,
          amount: this.homeExchangeViewModel.valueToSendFormControl.value,
          action: this.selectedAction,
        },
      });
    }
  }
}
