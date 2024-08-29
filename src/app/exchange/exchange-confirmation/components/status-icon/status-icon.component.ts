import { Component, Input } from '@angular/core';
import { IconStatus } from '../../type';

@Component({
  selector: 'app-status-icon',
  templateUrl: './status-icon.component.html',
  styleUrls: ['./status-icon.component.scss'],
})
export class StatusIconComponent {
  @Input() status: IconStatus = 'loading';
}
