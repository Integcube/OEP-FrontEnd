import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectPhase, ProjectPlan } from '../../project-plan.model';
import { ProjectPlanService } from '../project-plan.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { CSites, CUsers } from 'src/app/shared/common-interface/common-interface';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { User } from 'src/app/core/models/user';


@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.sass']
})
export class PlanFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  form:FormGroup;
  dialogTitle:string='';
  model:ProjectPlan;
  ProjectPhaseList:ProjectPhase[];
  PhaseList: ProjectPhase[];
  errorMessage: any;
  sites: CSites[];
  users: CUsers[];

  constructor
  (
    public dialogRef: MatDialogRef<PlanFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dataService: ProjectPlanService,
    private dataService2: CommonService, 
  ) 
  {
    super();
    this.model = this.data.model;
    this.dialogTitle = this.model.title?"Update Plan":'New Plan';
    this.form = this.createForm();
    this.removeValidators();
    this.PhaseList = [];
 
  }

  ngOnInit(): void {
    this.getSites(); 
    this.getusers();
 
   
  }


  removeValidators() {
    if(this.data.action == 'view'){
      for (const key in this.form.controls) {
        this.form.get(key).clearValidators();
        this.form.get(key).updateValueAndValidity();
      }
    }
  }



  createForm(): FormGroup {
    return this.fb.group({
      planId: [this.model.planId, [Validators.required]],
      title: [this.model.title, [Validators.required]],
      description: [this.model.description, [Validators.required]],
      pmId: [this.model.pmId, [Validators.required]],
      startDate: [this.model.startDate, [Validators.required]],
      siteId: [this.model.siteId, [Validators.required]],
      startplanId: [this.model.startplanId],
      
    })
  }
  submit() {
    if(this.form.valid){
      this.model = {...this.form.value};
      this.dialogRef.close(this.model)
    }
  }
  onNoClick() {
    this.dialogRef.close();
  }
  getSites() {

    this.subs.sink = this.dataService.getsites(this.user.id).subscribe({
      next: data => {
        this.sites = [...data];
  
      },
    })
  }
  getusers() {
  
    this.subs.sink = this.dataService2.getUsers(-1,-1,-1).subscribe({
      next: data => {
        const defaultUser = {
          userId: -1,
          userName: '-Select-',
          name: '-Select-',
          email: '-Select-',
          isSelected: false
        };
        this.users = [defaultUser, ...data];
  
      },
    })
  }
  
}
