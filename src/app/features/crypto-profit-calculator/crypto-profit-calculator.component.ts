import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-crypto-profit-calculator',
  templateUrl: './crypto-profit-calculator.component.html',
  styleUrls: ['./crypto-profit-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CryptoProfitCalculatorComponent {
  isOpened: boolean[] = [false, false, false, false];

  toggle(index: number): void {
    this.isOpened[index] = !this.isOpened[index];
  }
}
