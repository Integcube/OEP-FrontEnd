import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from 'src/app/authentication/page404/page404.component';
import { ProjectPlanComponent } from './project-plan/project-plan.component';
import {AddTaskComponent} from './project-plan/add-task/add-task.component'
import { StartPlanComponent } from './start-plan/start-plan.component';
import { AssignPlanComponent } from './start-plan/assign-plan/assign-plan.component';
import { ExcutePlanListComponent } from './excute-plan/excute-plan-list/excute-plan-list/excute-plan-list.component';
import { ExcutePlanViewComponent } from './excute-plan/excute-plan-view/excute-plan-view/excute-plan-view.component';
import { PgmAssignTaskComponent } from './pgm-assign-task/pgm-assign-task.component';
import { AssignTaskComponent } from './pgm-assign-task/assign-plan/assign-task.component';
import { ProjectKeyIssuesComponent } from './project-key-issues/project-key-issues.component';
import { MainPowerPlanComponent } from './main-power-plan/main-power-plan.component';

import { ProjectReadinessComponent } from './project-Readiness/project-readiness/project-readiness.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReadinessViewComponent } from './project-Readiness/create-checkList/readiness-view.component';

const routes : Routes = [
  {path:'', redirectTo:'project-plan',pathMatch:'full'},
  {path:'project-plan', component:ProjectPlanComponent},
  {path: 'add-task/:id',component:AddTaskComponent },
  {path:'start-plan', component:StartPlanComponent},
  {path:'assign-plan/:id', component:AssignPlanComponent},
  {path:'excute-plan', component:ExcutePlanListComponent},
  {path:'excute-plan/:id', component:ExcutePlanViewComponent},
  {path:'pgm-assign-task', component:PgmAssignTaskComponent},
  {path:'assign-task/:id', component:AssignTaskComponent},
  {path:'project-key-issues', component:ProjectKeyIssuesComponent},
  {path:'main_power_plan', component:MainPowerPlanComponent},
  {path:'project-Readiness', component:ProjectReadinessComponent},
  {path:'readiness-view/:id', component:ReadinessViewComponent},
  
  {path:'dashboard', component:DashboardComponent},
  {path:'**', component:Page404Component},
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class ProjectPlanRoutingModule { }
