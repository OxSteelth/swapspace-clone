import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademyComponent {}
