import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exchange-review',
  templateUrl: './exchange-review.component.html',
  styleUrls: ['./exchange-review.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeReviewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
