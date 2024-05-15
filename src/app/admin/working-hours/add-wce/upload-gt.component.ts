import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/core/models/user';
import { MonthlyHoursGt, UploadGt } from './upload-gt.model';
import { CUsers } from 'src/app/shared/common-interface/common-interface';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { UploadGtService } from './upload-gt.service';
import { AddWceComponent } from './dialog/add-wce/add-wce.component';

@Component({
  selector: 'app-add-wce',
  templateUrl: './upload-gt.component.html',
  styleUrls: ['./upload-gt.component.sass']
})
export class UploadGtComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  //Common Variables
  errorMessage: string;
  isTableLoading: boolean;
  //Get data from browsers Local Storage
  user: User = JSON.parse(localStorage.getItem('currentUser'));

  //Varaibles
  gtHours: UploadGt[];
  users: CUsers[];
  constructor(private snackBar: MatSnackBar, private dataService: UploadGtService, public dialog: MatDialog,) { super() }
  displayedColumns: string[] = ['id', 'regionTitle', 'siteTitle', 'unitTitle','startingHours','endOfContract', 'actions'];
  dataSource: MatTableDataSource<UploadGt>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<UploadGt>(this.gtHours);
    this.getWorkingHours();
  }
  getInterfaces(): void {
    this.subs.sink = this.dataService.getInterface(this.user.id).subscribe({
      next: data => {
        this.users = [...data];
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
    })
  }
  getWorkingHours(): void {
    this.isTableLoading = true;
    this.subs.sink = this.dataService.getWorkingHours(this.user.id).subscribe({
      next: data => {
        this.gtHours = [...data];
        this.dataSource.data = [...this.gtHours];
        this.isTableLoading = false;
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
    })
  }



  updateUnit(reg: UploadGt) {
    const dialogRef = this.dialog.open(AddWceComponent, {
      width: '750px',
      data: {
        equipment: reg
      },
    });
    dialogRef.afterClosed().subscribe((monthlyHours: MonthlyHoursGt[]) => {
      if ( monthlyHours || monthlyHours.length) {
        this.dataService.saveWorkingHours(this.user.id, monthlyHours).subscribe(
          {
            next: data => {
              this.showNotification('snackbar-success', 'Hours have been saved!!', 'bottom', 'center');
            },
            error: err => {
              this.showNotification('black', err, 'bottom', 'center');

            }
          }
        )
      }
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
