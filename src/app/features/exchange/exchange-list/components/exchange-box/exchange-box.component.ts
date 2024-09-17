import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, delay, of, Subscription, take, tap } from 'rxjs';
import { ExchangeListViewModel } from '../../viewmodel/exchange-list-view-model.';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exchange-box',
  templateUrl: './exchange-box.component.html',
  styleUrls: ['./exchange-box.component.scss'],
})
export class ExchangeBoxComponent {
  sub!: Subscription;
  isEstimatingExchange = signal(false);
  selectedAction = 'exchange';
  fixedRate = true;
  floatingRate = true;

  public rateOptionsForm = new FormGroup({
    fixedRateControl: new FormControl(true),
    floatingRateControl: new FormControl(true)
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public exchangeListViewModel: ExchangeListViewModel
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const from = params['from'];
      const to = params['to'];
      const ammount = params['amount'];
      const action = params['action'];

      this.exchangeListViewModel.currencyToSendFormControl.setValue(from);
      this.exchangeListViewModel.currencyToGetFormControl.setValue(to);
      this.exchangeListViewModel.valueToSendFormControl.setValue(ammount);
      this.selectedAction = action;
    });
  }

  selectDefaultCurrencies(tabIndex: number) {
    this.selectedAction = tabIndex === 0 ? 'exchange' : 'sell';

    if (tabIndex === 0) {
      this.exchangeListViewModel.currencyToSendFormControl.setValue('BTC');
      this.exchangeListViewModel.currencyToGetFormControl.setValue('ETH');
    } else if (tabIndex === 1) {
      this.exchangeListViewModel.currencyToSendFormControl.setValue('USD');
      this.exchangeListViewModel.currencyToGetFormControl.setValue('BTC');
    }
  }

  onSubmit(): void {}

  filterAmounts() {
    this.exchangeListViewModel.exchangeService.updateFixedRate(this.fixedRate);
    this.exchangeListViewModel.exchangeService.updateFloatingRate(this.floatingRate);
  }
}
