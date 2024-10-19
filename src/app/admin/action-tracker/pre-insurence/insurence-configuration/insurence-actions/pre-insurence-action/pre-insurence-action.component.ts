import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { CTechnology } from 'src/app/shared/common-interface/common-interface';
import { PreInsurenceAction } from '../../pre-insurenc.model';
import { PreInsurenceService } from '../../pre-insurence.service';

@Component({
  selector: 'app-insurence-action',
  templateUrl: './pre-insurence-action.component.html',
  styleUrls: ['./pre-insurence-action.component.sass']
})
export class PreInsurencActionComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  form:FormGroup;
  dialogTitle:string='';
  model:PreInsurenceAction;
  errorMessage: any;
  technologys: CTechnology[];
  roleList: any[]=[];
  roles: any[]=[];

  constructor
  (
    public dialogRef: MatDialogRef<PreInsurencActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dataService: PreInsurenceService,
    private dataService2: CommonService, 
  ) 
  {
    super();
    this.model = this.data.model;
    this.roleList =this.data.data
    this.dialogTitle = this.model.title?"Update Action":'New Action';
    this.form = this.createForm();
    this.removeValidators();
 
  }

  ngOnInit(): void {
    this.getDocumentsType();
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
      evidenceType: [''],
      guidelines: [this.model.guidelines],
      additionalGuidelines: [this.model.additionalGuidelines],
      preInsuranceActionId: [this.model.preInsuranceActionId],

    })
  }
  submit() {
    if (this.form.valid) {
   
      const result = {
        model:this.form.value,
        roleList:this.roleList
      };
      this.dialogRef.close(result);
    }
  }
  onNoClick() {
    this.dialogRef.close();
  }

  getDocumentsType() {
  
    this.subs.sink = this.dataService.DocumentsType( this.model.preInsuranceActionId).subscribe({
      next: data => {
  
        this.roles = [...data.data];
        this.roleList  = [...data.data2];
  
      },
    })
  }
  

  removeChip(value: any, name: string): void {
    if (name == 'role') {
      const index = this.roleList.indexOf(value);
      if (index >= 0) {
        this.roleList.splice(index, 1);
      }
    }
  }
  addChip(val: string, name: string) {
    if (val) {
      if (name == 'role') {
        let u = this.roles.find(a => a.id == +val)
        this.roleList.push(u);
        this.form.patchValue({
          evidenceType: ""
        })
      }
    }
  }

}
