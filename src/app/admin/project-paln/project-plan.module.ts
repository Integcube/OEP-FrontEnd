import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectPlanRoutingModule } from './project-plan-routing.module';
import { ProjectPlanComponent } from './project-plan/project-plan.component';
import { PlanFormComponent } from './project-plan/dialogs/plan-form.component';
import { ConfirmDeleteComponent } from './project-plan/dialogs/confirm-delete/confirm-delete.component';
import { AddTaskComponent } from './project-plan/add-task/add-task.component';
import { UniquePipe } from 'src/app/_pipes/unique.pipe';
import { AddNewTaskComponent } from './project-plan/add-task/create-task-dialog/add-new-task/add-new-task.component';
import { AddNewSubTaskComponent } from './project-plan/add-task/create-task-dialog/add-new-sub-task/add-new-sub-task.component';
import { AddNewPhaseComponent } from './project-plan/add-task/create-task-dialog/add-new-phase/add-new-phase.component';
import { StartPlanComponent } from './start-plan/start-plan.component';
import { AssignPlanComponent } from './start-plan/assign-plan/assign-plan.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ExcutePlanListComponent } from './excute-plan/excute-plan-list/excute-plan-list/excute-plan-list.component';
import { ExcutePlanViewComponent } from './excute-plan/excute-plan-view/excute-plan-view/excute-plan-view.component';
import { PgmAssignTaskComponent } from './pgm-assign-task/pgm-assign-task.component';
import { AssignTaskComponent } from './pgm-assign-task/assign-plan/assign-task.component';
import { ProjectKeyIssuesComponent } from './project-key-issues/project-key-issues.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MainPowerPlanComponent } from './main-power-plan/main-power-plan.component';

import { FileUploadDialogComponent } from './file-upload-dialog/file-upload-dialog.component';
import { ProjectReadinessComponent } from './project-Readiness/project-readiness/project-readiness.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReadinessFormComponent } from './project-Readiness/dialogs/readiness-form/plan-form.component';
import { ConfirmDeleteReadineesComponent } from './project-Readiness/dialogs/confirm-delete/confirm-delete.component';
import { ReadinessNewTaskComponent } from './project-Readiness/create-checkList/readiness-new-task/readiness-new-task.component';
import { ReadinessViewComponent } from './project-Readiness/create-checkList/readiness-view.component';
import { FileUploadDialogReadinessComponent } from './project-Readiness/file-upload-dialog/file-upload-dialog.component';
import { ConfirmCopyPlanComponent } from './project-plan/dialogs/confirm-copyPlan/confirm-copyPlan.component';
import { ReadineesPhasePhaseComponent } from './project-Readiness/create-checkList/add-new-phase/Readinees-phase.component';


@NgModule({
  declarations: [

    ProjectPlanComponent,
    PlanFormComponent,
    AddNewPhaseComponent,
    ConfirmDeleteComponent,
    AddTaskComponent,
    AddNewTaskComponent,
    AddNewSubTaskComponent,
    StartPlanComponent,
    AssignPlanComponent,
    ExcutePlanListComponent,
    ExcutePlanViewComponent,
    PgmAssignTaskComponent,
    AssignTaskComponent,
    ProjectKeyIssuesComponent,
    MainPowerPlanComponent,
    FileUploadDialogComponent,
    ProjectReadinessComponent,
    DashboardComponent,
    ReadinessFormComponent,
    ConfirmDeleteReadineesComponent,
    ReadineesPhasePhaseComponent,
    ReadinessNewTaskComponent,
    ReadinessViewComponent,
    FileUploadDialogReadinessComponent,
    ConfirmCopyPlanComponent
  ],
  imports: [
    ProjectPlanRoutingModule,
    CommonModule,
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
   
  ],

  providers: [DatePipe],
})
export class ProjectPlanModule { }
