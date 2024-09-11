import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ExchangeConfirmationViewModel } from '../../viewmodel/exchange-confirmation.viewmodel.';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, startWith, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-confirmation-card',
  templateUrl: './confirmation-card.component.html',
  styleUrls: ['./confirmation-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationCardComponent {
  termsOfUseControl = new FormControl<boolean>(true);
  isEstimatingExchange = signal(false);
  sub!: Subscription;
  sub2!: Subscription;
  constructor(
    public exchangeConfirmation: ExchangeConfirmationViewModel,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initWithQueryParams();
    this.watch();
  }

  initWithQueryParams() {
    this.sub2 = this.route.queryParams.subscribe(async (params) => {
      const from = params['from'];
      const to = params['to'];
      const ammount = params['amount'];
      const exchange = params['exchange'];

      this.exchangeConfirmation.currencyToSendFormControl.setValue(from);
      this.exchangeConfirmation.currencyToGetFormControl.setValue(to);
      this.exchangeConfirmation.valueToSendFormControl.setValue(ammount);

      this.isEstimatingExchange.set(true);
      await this.exchangeConfirmation.setExchange(exchange);
      this.exchangeConfirmation.estimateExchange();
      this.isEstimatingExchange.set(false);

      const confirmationId = params['confirmationId'];

      if (confirmationId) {
        this.exchangeConfirmation.watchConfirmation(confirmationId);
      }
    });
  }

  watch() {
    this.sub = this.exchangeConfirmation.form.valueChanges
      .pipe(
        tap(() => {
          this.isEstimatingExchange.set(true);
        }),
        debounceTime(500),
        tap(async () => {
          await this.exchangeConfirmation.estimateExchange();
          this.isEstimatingExchange.set(false);
        })
      )
      .subscribe();
  }

  onSubmit() {
    this.exchangeConfirmation.confirm();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }
}
