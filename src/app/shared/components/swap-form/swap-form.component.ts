import { Component } from '@angular/core';
import { SwapFormQueryService } from '@app/shared/services/swap-form-query/swap-form-query.service';
import { SwapFormService } from '@shared/services/swap-form.service';

@Component({
  selector: 'app-swap-form',
  templateUrl: './swap-form.component.html',
  styleUrls: ['./swap-form.component.scss']
})
export class SwapFormComponent {
  public loading: boolean = false;

  public readonly fromChain$ = this.swapFormService.fromBlockchain$;

  public readonly toChain$ = this.swapFormService.toBlockchain$;

  public readonly fromAsset$ = this.swapFormService.fromToken$;

  public readonly toAsset$ = this.swapFormService.toToken$;

  public readonly fromAmount$ = this.swapFormService.fromAmount$;

  public readonly toAmount$ = this.swapFormService.toAmount$;

  constructor(
    private readonly swapFormService: SwapFormService,
    private readonly swapFormQueryService: SwapFormQueryService
  ) {}

  public updateInputValue(value: string): void {
    const oldValue = this.swapFormService.inputValue?.fromAmount;
    if (!oldValue || oldValue !== value) {
      this.swapFormService.inputControl.patchValue({
        fromAmount: value ? value : null
      });
    }
  }

  public async revert(): Promise<void> {
    const { fromBlockchain, toBlockchain, fromToken, toToken } = this.swapFormService.inputValue;
    const { toAmount } = this.swapFormService.outputValue;

    this.swapFormService.inputControl.patchValue({
      fromBlockchain: toBlockchain,
      fromToken: toToken,
      toToken: fromToken,
      toBlockchain: fromBlockchain,
      ...(Number(toAmount) > 0 && {
        fromAmount: toAmount
      })
    });
    this.swapFormService.outputControl.patchValue({
      toAmount: null
    });
  }
}
