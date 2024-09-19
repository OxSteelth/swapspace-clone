import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';

@Component({
  selector: 'app-exchange-confirmation',
  templateUrl: './exchange-confirmation.component.html',
  styleUrls: ['./exchange-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeConfirmationComponent implements OnInit {
  constructor(private swapFormQueryService: SwapFormQueryService) {}

  ngOnInit(): void {
    this.swapFormQueryService.subscribeOnQueryParams();
    this.swapFormQueryService.subscribeOnSwapForm();
  }
}