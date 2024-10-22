import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-success-stories',
  templateUrl: './success-stories.component.html',
  styleUrls: ['./success-stories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessStoriesComponent {}
