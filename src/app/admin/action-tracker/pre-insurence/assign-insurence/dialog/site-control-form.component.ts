import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { AssignInsurenceService } from '../assign-insurence.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-site-control-form',
  templateUrl: './site-control-form.component.html',
  styleUrls: ['./site-control-form.component.sass']
})
export class SiteControlFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  siteId: number;
  siteControl:any[];
  dialogTitle:string;
  years: { title: string, value: number }[];
  selectedYear: number;
  errorMessage:string;
  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SiteControlFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: AssignInsurenceService,
  ) { 
    super() 
    this.siteId = this.data.siteId;}
  ngOnInit(): void {

    this.years = this.getYears(2020); 
    this.selectedYear = this.years.length > 0 ? this.years[0].value : null;
    this.getSiteControl();
  }

  submit() {
    this.dialogRef.close({
      siteControl: this.siteControl,
      selectedYear: this.selectedYear
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }

  getSiteControl(): void {
    this.subs.sink = this.dataService.getSelectedSiteControl(this.siteId,this.selectedYear).subscribe({
      next: data => {
        this.siteControl = [...data];
      },
      error: err => {this.errorMessage = err;this.showNotification('black', err, 'bottom', 'center')},
    })
  }

  getYears(startYear: number): { title: string, value: number }[] {
    const currentYear = new Date().getFullYear();
    const years: { title: string, value: number }[] = [];

    for (let year = startYear; year <= currentYear; year++) {
      years.push({ title: year.toString(), value: year });
    }

    return years.sort((a, b) => b.value - a.value);
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
