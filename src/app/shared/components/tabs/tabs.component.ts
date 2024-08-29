import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input() tabs: string[] = [];
  @Input() activeTabIndex: number = 0;
  @Output() activeTabIndexChange = new EventEmitter();

  selectTab(index: number) {
    this.activeTabIndex = index;
    this.activeTabIndexChange.emit(index);
  }
}
