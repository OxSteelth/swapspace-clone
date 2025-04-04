import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogModule,
  TuiDropdownModule,
  TuiGroupModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule
} from '@taiga-ui/core';
import {
  TuiActiveZoneModule,
  TuiDestroyService,
  TuiLetModule,
  TuiPortalModule
} from '@taiga-ui/cdk';
import {
  TuiAccordionModule,
  TuiCarouselModule,
  TuiCheckboxModule,
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiMultiSelectModule,
  TuiPaginationModule,
  TuiSelectModule
} from '@taiga-ui/kit';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxLiteYoutubeModule } from 'ngx-lite-video';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { LetDirective } from './directives/let/let.directive';
import { CyrrencyAmountSelectorComponent } from './components/cyrrency-amount-selector/cyrrency-amount-selector.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { DateDiffPipe } from './pipes/date-diff.pipe';
import { FormValuePipe } from './pipes/form-value.pipe';
import { AssetSelectorComponent } from './components/asset-selector/asset-selector.component';
import { FormSwitcherComponent } from './components/form-switcher/form-switcher.component';
import { SwapFormComponent } from './components/swap-form/swap-form.component';
import { SwapFormService } from './services/swap-form.service';
import { SwapFormQueryService } from './services/swap-form-query/swap-form-query.service';
import { ExchangeInfoComponent } from '@app/features/exchange/info/exchange-info.component';
import { StatusIconComponent } from '@app/features/exchange/status/status-icon/status-icon.component';
import { ExchangeStatusComponent } from '@app/features/exchange/status/exchange-status.component';

@NgModule({
  declarations: [
    LetDirective,
    CyrrencyAmountSelectorComponent,
    TabsComponent,
    DateDiffPipe,
    FormValuePipe,
    AssetSelectorComponent,
    FormSwitcherComponent,
    SwapFormComponent,
    ExchangeInfoComponent,
    ExchangeStatusComponent,
    StatusIconComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
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
    ScrollingModule,
    FormsModule,
    RouterModule,
    NgxLiteYoutubeModule,
    NgxMapboxGLModule
  ],
  providers: [AsyncPipe, TuiDestroyService, SwapFormService, SwapFormQueryService],
  exports: [
    LetDirective,
    CommonModule,
    RouterModule,
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
    SwapFormComponent,
    TuiCarouselModule,
    TuiPaginationModule,
    NgxLiteYoutubeModule,
    NgxMapboxGLModule,
    AssetSelectorComponent,
    FormSwitcherComponent,
    ExchangeInfoComponent,
    ExchangeStatusComponent,
    StatusIconComponent
  ]
})
export class SharedModule {}
