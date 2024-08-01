import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectPhase, ProjectPlan, ProjectPlanMainTask, ProjectPlanTaskVm } from 'src/app/admin/project-paln/project-plan.model';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

// import { ProjectPlanService } from '../../../project-plan.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectReadinessPhase } from '../../project-Readiness.model';

@Component({
  selector: 'app-Readinees-phase',
  templateUrl: './Readinees-phase.component.html',
  styleUrls: ['./Readinees-phase.component.sass']
})
export class ReadineesPhasePhaseComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

    form:FormGroup;
    dialogTitle:string='';
    model:ProjectReadinessPhase;

    constructor
    (
      public dialogRef: MatDialogRef<ReadineesPhasePhaseComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      // private dataService: ProjectPlanService,
      private route: ActivatedRoute,
    ) 
    {
      super();
      this.model = this.data.model;
      this.dialogTitle = this.model.title?"Update Phase":'New Phase';
      this.form = this.createForm();
      this.removeValidators();
    }
    ngOnInit(): void {

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
        phaseId: [this.model.phaseId, [Validators.required]],
        title: [this.model.title, [Validators.required]],
        weightage: [this.model.weightage, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]*)?$/)]],
        planId: [this.model.planId, [Validators.required]],
        displayOrder: [this.model.displayOrder, [Validators.required]],
        
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

}
