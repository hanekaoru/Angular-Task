import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../directive/directive.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { 
  MdToolbarModule, 
  MdIconModule, 
  MdButtonModule ,
  MdCardModule,
  MdInputModule,
  MdListModule,
  MdSlideToggleModule,
  MdGridListModule,
  MdDialogModule,
  MdAutocompleteModule,
  MdMenuModule,
  MdCheckboxModule,
  MdTooltipModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdRadioModule,
  MdSelectModule,
  MdSidenavModule,
  MdButtonToggleModule,
  MdChipsModule,
  MdTabsModule
} from '@angular/material';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ImageListSelectComponent } from './image-list-select/image-list-select.component';
import { AgeInputComponent } from './age-input/age-input.component';
import { ChipsListComponent } from './chips-list/chips-list.component';
import { IdentityInputComponent } from './identity-input/identity-input.component';
import { AreaListComponent } from './area-list/area-list.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MdToolbarModule, 
    MdIconModule, 
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    MdListModule,
    MdSlideToggleModule,
    MdGridListModule,
    MdDialogModule,
    MdAutocompleteModule,
    MdMenuModule,
    MdCheckboxModule,
    MdTooltipModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdButtonToggleModule,
    MdRadioModule,
    MdSelectModule,
    MdSidenavModule,
    DirectiveModule,
    MdChipsModule,
    MdTabsModule
  ],
  exports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MdToolbarModule, 
    MdIconModule, 
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    MdListModule,
    MdSlideToggleModule,
    MdGridListModule,
    MdDialogModule,
    MdAutocompleteModule,
    MdMenuModule,
    MdCheckboxModule,
    MdTooltipModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdRadioModule,
    MdSelectModule,
    MdSidenavModule,
    DirectiveModule,
    ImageListSelectComponent,
    AgeInputComponent,
    MdButtonToggleModule,
    ChipsListComponent,
    MdChipsModule,
    IdentityInputComponent, 
    AreaListComponent,
    MdTabsModule
  ],
  declarations: [
    ConfirmDialogComponent, 
    ImageListSelectComponent, 
    AgeInputComponent, 
    ChipsListComponent, 
    IdentityInputComponent, 
    AreaListComponent
  ],
  entryComponents: [ConfirmDialogComponent]
})

export class SharedModule { }
