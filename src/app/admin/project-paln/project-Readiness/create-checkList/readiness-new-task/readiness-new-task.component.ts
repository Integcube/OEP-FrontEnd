import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectPhase, ProjectPlan, ProjectPlanMainTask, ProjectPlanTaskVm } from 'src/app/admin/project-paln/project-plan.model';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

// import { ProjectPlanService } from '../../../project-plan.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectReadinessTask } from '../../project-Readiness.model';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { CUsers } from 'src/app/shared/common-interface/common-interface';

@Component({
  selector: 'app-readiness-new-task',
  templateUrl: './readiness-new-task.component.html',
  styleUrls: ['./readiness-new-task.component.sass']
})
export class ReadinessNewTaskComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

    form:FormGroup;
    dialogTitle:string='';
    model:ProjectReadinessTask;
    ProjectPhaseList:ProjectPhase[];
    users: CUsers[];
    constructor
    (
      public dialogRef: MatDialogRef<ReadinessNewTaskComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private dataService2: CommonService, 
      // private dataService: ProjectPlanService,
      private route: ActivatedRoute,
    ) 
    {
      super();
      this.model = this.data.model;
      this.dialogTitle = this.model.title?"Update Main Task against Phase":'New Main Task against Phase';
      this.form = this.createForm();
      this.removeValidators();
      this.ProjectPhaseList = [];
   
    }
    ngOnInit(): void {
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
        taskId: [this.model.taskId, [Validators.required]],
        title: [this.model.title, [Validators.required]],
        phaseId: [this.model.phaseId, [Validators.required]],
        actualScore: [this.model.actualScore, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]*)?$/)]],
        planId: [this.model.planId, [Validators.required]],
        idealScore: [this.model.idealScore, [Validators.required]],
        targetdate: [this.model.targetdate],
        remarks: [this.model.remarks],
        responsibility:[this.model.responsibility],
      })
    }

    submit() {
      if(this.form.valid){
        this.model = {...this.form.value};
        this.dialogRef.close(this.model)
      }
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

    onNoClick() {
      this.dialogRef.close();
    }




}
