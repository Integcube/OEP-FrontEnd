import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

import { User } from 'src/app/core/models/user';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AssignInsurenceService } from './assign-insurence.service';
import { SiteControlFormComponent } from './dialog/site-control-form.component';

@Component({
  selector: 'app-assign-insurence',
  templateUrl: './assign-insurence.component.html',
  styleUrls: ['./assign-insurence.component.sass']
})
export class AssignInsurenceComponent extends UnsubscribeOnDestroyAdapter implements OnInit, AfterViewInit {


  siteControl: any[];
  isTableLoading: boolean;
  errorMessage:string;

  user: User = JSON.parse(localStorage.getItem('currentUser'));
  constructor(private snackBar: MatSnackBar, private dataService: AssignInsurenceService, public dialog: MatDialog,) { super() }

  displayedColumns: string[] = ['id','regionTitle','siteTitle', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.siteControl);
 
    this.getSiteControl();
  }

  getSiteControl(): void {
    this.isTableLoading = true;
    this.subs.sink = this.dataService.getSiteControl(this.user.id).subscribe({
      next: data => {
        this.siteControl = [...data];
        this.dataSource.data = [...this.siteControl];
        this.isTableLoading = false;
      },
      error: err => {this.errorMessage = err;this.showNotification('black', err, 'bottom', 'center')},
    })
  }
  viewSiteControl( siteControl: any){
    // this.subs.sink = this.dataService.getSelectedSiteControl(siteControl.siteId).subscribe({
    //   next:data=>{
    //     const dialogRef = this.dialog.open(SiteControlFormComponent, {
    //       width: '750px',
    //       data: {
    //         siteControl:[...data],
    //         siteData:{...siteControl},
    //         action: "view",
    //       },
    //     });
    //   },
    //   error:err=>{
    //     this.errorMessage = err;
    //     this.showNotification('black', err, 'bottom', 'center');
    //   }
    // })
  }

  updateSiteControl( siteControl: any){
 
        const dialogRef = this.dialog.open(SiteControlFormComponent, {
          width: '750px',
          data: {
            siteId: siteControl.siteId,
            action: "edit",
          },
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            debugger
            this.subs.sink = this.dataService.saveSiteControl(this.user.id,siteControl.siteId,result).subscribe({
              next:data=>{
                this.showNotification('snackbar-success', siteControl.siteId +' has been updated sucessfully', 'bottom', 'center');
                this.getSiteControl();
              },
              error:err=>{
                this.errorMessage = err;
                this.showNotification('black', err, 'bottom', 'center');
              }
            })
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
