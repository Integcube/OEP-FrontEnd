import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-copyPlan',
  templateUrl: './confirm-copyPlan.component.html',
  styleUrls: ['./confirm-copyPlan.component.sass']
})
export class ConfirmCopyPlanComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmCopyPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
      this.data;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }



}
