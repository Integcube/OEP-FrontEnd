import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.sass']
})
export class ConfirmDeleteReadineesComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmDeleteReadineesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
      this.data;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }



}
