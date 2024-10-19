import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/core/models/user';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { PreInsurenceService } from '../pre-insurence.service';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Preinsurence } from '../pre-insurenc.model';
import { ConfirmDeleteComponent } from '../../../regions/region-main/dialogs/confirm-delete/confirm-delete.component';
import { PreInsurencForComponent } from './pre-insurence-form/pre-insurence-form.component';

@Component({
  selector: 'app-pre-insurence-list',
  templateUrl: './pre-insurence-list.component.html',
  styleUrls: ['./pre-insurence-list.component.sass']
})
export class PreInsurenceListComponent extends UnsubscribeOnDestroyAdapter implements OnInit, AfterViewInit {

  user: User = JSON.parse(localStorage.getItem('currentUser'));
  dataSource: MatTableDataSource<any>;
  isTableLoading: boolean;
  displayedColumns: string[] = ['preInsuranceId', 'title','technology','createdBy','createdOn', 'actions'];
  userForm: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  errorMessage: any;
 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 
  constructor(
    private dataService: PreInsurenceService,
    private dataService2: CommonService, 
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
    
    ) { super() }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
    this.getProjectPlans();

  }

  getProjectPlans() {
    this.isTableLoading = true;
    this.subs.sink = this.dataService.getData(this.user.id).subscribe({
      next: data => {
        this.dataSource.data = [...data];
        this.isTableLoading = false;
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  update(Data:any) {
    this.add(Data);
  }

NewAdd(){
  this.add(new Preinsurence({}));
}

  add(Data:any) {
    const dialogRef = this.dialog.open(PreInsurencForComponent, {
      width: '500px',
      data: {
        model:Data,
      },
    })

    dialogRef.afterClosed().subscribe((result: Preinsurence) => {
      if (result) {
        this.subs.sink = this.dataService.saveplan(this.user.id,result).subscribe({
          next: data => {
            this.getProjectPlans();
           this.showNotification('snackbar-success','Data Saved sucessfully', 'bottom', 'center');

          },
          error: err => {
            this.errorMessage = err;
            this.showNotification('black', err, 'bottom', 'center');
          }
        })
      }
    })
  }

  deletePlan(reg: any) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        region: reg
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.subs.sink = this.dataService.delete(result).subscribe({
          next: data => {
            this.getProjectPlans();
           this.showNotification('snackbar-success', result.title + ' has been deleted sucessfully', 'bottom', 'center');
          },
          error: err => {
            this.errorMessage = err;
            this.showNotification('black', err, 'bottom', 'center');
          }
        })
      }
    })
  }

  AddTask(row: any) {
    const id = row.preInsuranceId; 
    this.router.navigate(['/admin/action-tracker/pre-Insurence/insurence-actions', id]);
  }

}
