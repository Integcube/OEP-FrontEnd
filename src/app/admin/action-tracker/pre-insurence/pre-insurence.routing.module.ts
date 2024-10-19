// dashboard-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreInsurenceListComponent } from './insurence-configuration/pre-insurence-list/pre-insurence-list.component';
import { InsurenceActionsComponent } from './insurence-configuration/insurence-actions/insurence-actions.component';
import { AssignInsurenceComponent } from './assign-insurence/assign-insurence.component';
import { ExcuteInsurenceComponent } from './Excute-insurence/Excute-insurence.component';
import { PreviewInsurenceComponent } from './preview-insurence/preview-insurence.component';



const routes: Routes = [
  { path: '', redirectTo:'insurence-list',pathMatch:'full'}, 
  {path:'insurence-list', component:PreInsurenceListComponent},
  {path:'insurence-actions/:id', component:InsurenceActionsComponent},
  {path:'assign-insurence', component:AssignInsurenceComponent},
  {path:'excute-insurence', component:ExcuteInsurenceComponent},
  {path:'preview-insurence', component:PreviewInsurenceComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreInsurenceRoutingModule { }
