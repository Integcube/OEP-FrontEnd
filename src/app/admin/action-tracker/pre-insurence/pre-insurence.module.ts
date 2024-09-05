import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreInsurenceRoutingModule } from './pre-insurence.routing.module';
import { PreInsurenceListComponent } from './insurence-configuration/pre-insurence-list/pre-insurence-list.component';
import { InsurenceActionsComponent } from './insurence-configuration/insurence-actions/insurence-actions.component';



@NgModule({
  declarations: [
    PreInsurenceListComponent,
    InsurenceActionsComponent
  ],
  imports: [
    CommonModule,
    PreInsurenceRoutingModule
  ]
})
export class PreInsurenceModule { }
