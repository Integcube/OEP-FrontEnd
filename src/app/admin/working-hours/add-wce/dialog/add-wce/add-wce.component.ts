import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadGtService } from '../../upload-gt.service';
import { MonthlyHoursGt, UploadGt } from '../../upload-gt.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-add-wce',
  templateUrl: './add-wce.component.html',
  styleUrls: ['./add-wce.component.sass']
})
export class AddWceComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  dialogTitle: string
  yearList: number[] = [];
  selectedYear: number;
  monthlyHours:MonthlyHoursGt[]=[];
  
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  constructor(
    public dialogRef: MatDialogRef<AddWceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipment: UploadGt },
    private fb: FormBuilder,
    private dataService: UploadGtService,
    private snackBar: MatSnackBar,
  ) { super() }
  save() {
    this.dialogRef.close(this.monthlyHours);

  }
  ngOnInit(): void {
    this.dialogTitle = this.data.equipment.unitTitle;
    this.calculateYears(this.data.equipment.startingHours, this.data.equipment.endOfContract);
  }
  calculateYears(startHours: Date, endHours: Date) {
    const differenceInYears: number = (new Date(endHours)).getFullYear() - (new Date(startHours)).getFullYear();
    for (let za = 0; za < differenceInYears; za++) {
      let yearToAdd: number = (new Date(startHours)).getFullYear() + za + 1;
      this.yearList.push(yearToAdd);
    }
    this.selectedYear = this.yearList[0];
    this.getData(this.selectedYear);
  }
  onNoClick() {
    this.dialogRef.close();
  }
  getData(selectedYear) {
    this.subs.sink = this.dataService.getMonthlyHours(+selectedYear, this.data.equipment.unitId).subscribe({
      next: data => {
        this.monthlyHours = [...data] 
      },
      error: err => { this.showNotification('black', err, 'bottom', 'center') },
    })
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
