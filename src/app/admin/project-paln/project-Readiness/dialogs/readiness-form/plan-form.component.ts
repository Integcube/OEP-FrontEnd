import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { CSites, CUsers } from 'src/app/shared/common-interface/common-interface';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { User } from 'src/app/core/models/user';
import { ProjectReadiness } from '../../project-Readiness.model';
import { ProjectReadinessService } from '../../project-readiness.service';


@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.sass']
})
export class ReadinessFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  form:FormGroup;
  dialogTitle:string='';
  model:ProjectReadiness;
  // ProjectPhaseList:ProjectPhase[];
  // PhaseList: ProjectPhase[];
  errorMessage: any;
  sites: CSites[];
  users: CUsers[];

  constructor
  (
    public dialogRef: MatDialogRef<ReadinessFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dataService: ProjectReadinessService,
    private dataService2: CommonService,
 
  ) 
  {
    super();
    this.model = this.data.model;
    this.dialogTitle = this.model.title?"Update Readinees CheckList":'New Readinees CheckList';
    this.form = this.createForm();
    this.removeValidators();

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
      assignTo: [this.model.assignTo, [Validators.required]],
      siteId: [this.model.siteId, [Validators.required]],
      
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
   
        this.users = [...data];
  
      },
    })
  }
  
}
