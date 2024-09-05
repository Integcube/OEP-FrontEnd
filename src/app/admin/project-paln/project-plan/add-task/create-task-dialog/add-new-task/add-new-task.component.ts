import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectPhase, ProjectPlan, ProjectPlanMainTask, ProjectPlanTaskVm } from 'src/app/admin/project-paln/project-plan.model';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

import { ProjectPlanService } from '../../../project-plan.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-new-task',
  templateUrl: './add-new-task.component.html',
  styleUrls: ['./add-new-task.component.sass']
})
export class AddNewTaskComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

    form:FormGroup;
    dialogTitle:string='';
    model:ProjectPlanMainTask;
    ProjectPhaseList:ProjectPhase[];
    PredecessorTaskList:any[];
    PredecessorTypeList:any[];
    constructor
    (
      public dialogRef: MatDialogRef<AddNewTaskComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private dataService: ProjectPlanService,
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

    this.getPredecessorTask();
    this.getpredecessorType();
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
        // weightage: [this.model.weightage, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]*)?$/)]],
        phaseId: [this.model.phaseId, [Validators.required]],
        duration: [this.model.duration, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]*)?$/)]],
        planId: [this.model.planId, [Validators.required]],
        predecessorId: [this.model.predecessorId],
        lagDays: [this.model.lagDays],
        predecessorType: [this.model.predecessorType],
        durationUnit:[this.model.durationUnit],
        lagUnit:[this.model.lagUnit],
        taskdisplayOrder:[this.model.taskdisplayOrder, [Validators.required]],
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

    getPredecessorTask() {
      this.subs.sink = this.dataService.getpredecessorTask(this.model.planId).subscribe({
        next: data => {
          this.PredecessorTaskList= [...data];
        }
      })
    }
    getpredecessorType() {
      this.subs.sink = this.dataService.getpredecessorType().subscribe({
        next: data => {
          this.PredecessorTypeList= [...data];
        }
      })
    }

}
