import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  TuiDataListModule,
  TuiDialogModule,
  TuiLoaderModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiActiveZoneModule, TuiPortalModule } from '@taiga-ui/cdk';
import { TuiAccordionModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiDropdownModule } from '@taiga-ui/core';
import { TuiHostedDropdownModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiGroupModule } from '@taiga-ui/core';
import { TuiInputNumberModule } from '@taiga-ui/kit';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { CyrrencyAmountSelectorComponent } from './components/cyrrency-amount-selector/cyrrency-amount-selector.component';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TabsComponent } from './components/tabs/tabs.component';
import { DateDiffPipe } from './pipes/date-diff.pipe';
import { FormValuePipe } from './pipes/form-value.pipe';
import { TuiCheckboxModule } from '@taiga-ui/kit';

@NgModule({
  declarations: [
    CyrrencyAmountSelectorComponent,
    TabsComponent,
    DateDiffPipe,
    FormValuePipe,
  ],
  imports: [
    CommonModule,
    TuiDialogModule,
    TuiSvgModule,
    TuiAccordionModule,
    TuiActiveZoneModule,
    TuiButtonModule,
    TuiDataListModule,
    TuiDropdownModule,
    TuiHostedDropdownModule,
    TuiPortalModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiMultiSelectModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    TuiGroupModule,
    TuiInputNumberModule,
    TuiTableModule,
    TuiLetModule,
    TuiLoaderModule,
    TuiCheckboxModule,
  ],
  providers: [AsyncPipe],
  exports: [
    CommonModule,
    TuiDialogModule,
    TuiSvgModule,
    TuiAccordionModule,
    TuiActiveZoneModule,
    TuiButtonModule,
    TuiDataListModule,
    TuiDropdownModule,
    TuiHostedDropdownModule,
    TuiPortalModule,
    TuiInputModule,
    TuiMultiSelectModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    TuiGroupModule,
    TuiInputNumberModule,
    TuiTableModule,
    CyrrencyAmountSelectorComponent,
    TuiLetModule,
    ReactiveFormsModule,
    TuiLoaderModule,
    TabsComponent,
    DateDiffPipe,
    FormValuePipe,
    TuiCheckboxModule,
  ],
})
export class SharedModule {}
