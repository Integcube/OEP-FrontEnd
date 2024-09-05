// dashboard-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreInsurenceListComponent } from './insurence-configuration/pre-insurence-list/pre-insurence-list.component';


const routes: Routes = [
  { path: '', component: PreInsurenceListComponent }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreInsurenceRoutingModule { }
