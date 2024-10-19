import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreInsurenceRoutingModule } from './pre-insurence.routing.module';
import { PreInsurenceListComponent } from './insurence-configuration/pre-insurence-list/pre-insurence-list.component';
import { InsurenceActionsComponent } from './insurence-configuration/insurence-actions/insurence-actions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableExporterModule } from 'mat-table-exporter';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreInsurencForComponent } from './insurence-configuration/pre-insurence-list/pre-insurence-form/pre-insurence-form.component';
import { PreInsurencActionComponent } from './insurence-configuration/insurence-actions/pre-insurence-action/pre-insurence-action.component';
import { AssignInsurenceComponent } from './assign-insurence/assign-insurence.component';
import { SiteControlFormComponent } from './assign-insurence/dialog/site-control-form.component';
import { ExcuteInsurenceComponent } from './Excute-insurence/Excute-insurence.component';
import { ExcuteInsurenceFormComponent } from './Excute-insurence/dialogs/Excute-insurence-form.component';
import { PreviewInsurenceComponent } from './preview-insurence/preview-insurence.component';
import { PreviewInsurenceFormComponent } from './preview-insurence/dialogs/preview-insurence-form.component';
import { FileUploadDialogComponent } from '../file-upload-dialog/file-upload-dialog.component';
import { FileUploadComponent } from './file-upload-dialog/file-upload-dialog.component';



@NgModule({
  declarations: [
    PreInsurenceListComponent,
    InsurenceActionsComponent,
    PreInsurencForComponent,
    PreInsurencActionComponent,
    AssignInsurenceComponent,
    SiteControlFormComponent,
    ExcuteInsurenceComponent,
    ExcuteInsurenceFormComponent,
    PreviewInsurenceComponent,
    PreviewInsurenceFormComponent,
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    PreInsurenceRoutingModule,
    MatTableExporterModule,
    MatMenuModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    PerfectScrollbarModule,
    MatSortModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTooltipModule,
    ComponentsModule,
    SharedModule,
    MatDatepickerModule ,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
  ]
})
export class PreInsurenceModule { }
