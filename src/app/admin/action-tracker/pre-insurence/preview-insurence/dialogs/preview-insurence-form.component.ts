import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, DialogPosition } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';;
import { User } from 'src/app/core/models/user';
import { FileUploadDialogComponent } from '../../../file-upload-dialog/file-upload-dialog.component';
import { PreviewInsurenceService } from '../preview-insurence.service';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { CUsers } from 'src/app/shared/common-interface/common-interface';

@Component({
  selector: 'app-preview-insurence-form',
  templateUrl: './preview-insurence-form.component.html',
  styleUrls: ['./preview-insurence-form.component.sass']
})
export class PreviewInsurenceFormComponent extends UnsubscribeOnDestroyAdapter {
  action: any
  actionForm: FormGroup
  dialogTitle: string
  conc: string;
  nameToRemove:any[]=['Mr. Test','Nikhil Maheta'];
  userData:CUsers[]=[];
  statusList:any[]=[];
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  constructor(
    public dialogRef: MatDialogRef<PreviewInsurenceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
     private dataService: PreviewInsurenceService,
    public dialog: MatDialog,
    private dataService2 :CommonService,
    
  ) {
    super()
    debugger
    this.action = { ...this.data?.outageAction }
    this.dialogTitle = this.action.siteTitle + " - " + this.action.recommendationTitle + " - "+this.action.yearId
    this.actionForm = this.buildForm();
  }

  ngOnInit(): void {
   
   this.getStatus();
   this.getuser();
  
  }

  buildForm(): FormGroup {
    return this.fb.group({
      yearId: [this.action.yearId, [Validators.required]],
      siteComments: [this.action.siteComments],
      responsible: [this.action.responsible],
      statusId: [this.action.statusId, [Validators.required]],
      siteId: [this.action.siteId, [Validators.required]],
      preInsuranceActionId: [this.action.preInsuranceActionId],
      preInsuranceId: [this.action.preInsuranceId, [Validators.required]],
      adminComments: [this.action.adminComments, [Validators.required]],
      adminFlag: [this.action.adminFlag],
    })
  }


  uploadEvidence() {
    const dialogPosition: DialogPosition = {
      right: 30 + 'px'
    };
    const dialogRef = this.dialog.open(FileUploadDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '340px',
      height: '700px',
      position: dialogPosition,
      data: {
        outageTracker: this.action,
        action: 'outageTracker',
        mode: 'edit'
      },
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  submit() {
    debugger
    if (this.actionForm.valid) {
      const formValues = this.actionForm.value;
      this.dialogRef.close(formValues);
  
    }
  }
  onNoClick() {
    this.dialogRef.close();
  }

  getuser() {
    this.subs.sink = this.dataService2.getUsers(this.user.id,-1,this.action.siteId).subscribe({
      next: data => {
        this.userData = [...data];
  
      },
    })
  }

  getStatus() {
    this.subs.sink = this.dataService.getActionStatus().subscribe({
      next: data => {
        this.statusList = [...data];
      },
    })
  }
}
