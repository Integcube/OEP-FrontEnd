import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { CTechnology } from 'src/app/shared/common-interface/common-interface';
import { Preinsurence } from '../../pre-insurenc.model';
import { PreInsurenceService } from '../../pre-insurence.service';

@Component({
  selector: 'app-pre-insurence-form',
  templateUrl: './pre-insurence-form.component.html',
  styleUrls: ['./pre-insurence-form.component.sass']
})
export class PreInsurencForComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  form:FormGroup;

 dialogTitle:string='';
  model:Preinsurence;
  errorMessage: any;
  technologys: CTechnology[];
  constructor
  (
    public dialogRef: MatDialogRef<PreInsurencForComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dataService: PreInsurenceService,
    private dataService2: CommonService, 
  ) 
  {
    super();
    this.model = this.data.model;
    this.dialogTitle = this.model.title?"Update Recommendation Title":'New Recommendation Title';
    this.form = this.createForm();
    this.removeValidators();
 
  }


  ngOnInit(): void {
    this.getTechnology();
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
      preInsuranceId: [this.model.preInsuranceId, [Validators.required]],
      title: [this.model.title, [Validators.required]],
      techId: [this.model.techId, [Validators.required]],
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

  getTechnology() {
  
    this.subs.sink = this.dataService2.getTechnology(this.user.id,-1,-1).subscribe({
      next: data => {
  
        this.technologys = [...data];
  
      },
    })
  }
  

}
