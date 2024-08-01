import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/core/models/user';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { ProjectReadinessService } from '../project-readiness.service';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProjectReadiness } from '../project-Readiness.model';
import { ReadinessFormComponent } from '../dialogs/readiness-form/plan-form.component';
import { ConfirmDeleteReadineesComponent } from '../dialogs/confirm-delete/confirm-delete.component';
import { ConfirmCopyPlanComponent } from '../../project-plan/dialogs/confirm-copyPlan/confirm-copyPlan.component';

@Component({
  selector: 'app-project-readiness',
  templateUrl: './project-readiness.component.html',
  styleUrls: ['./project-readiness.component.sass']
})
export class ProjectReadinessComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  dataSource: MatTableDataSource<any>;
  isTableLoading: boolean;
  displayedColumns: string[] = ['planId', 'plan','site','assignTo','user','createdOn', 'actions'];
  userForm: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  errorMessage: any;
 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    private dataService: ProjectReadinessService,
    private dataService2: CommonService, 
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router

  ) { 

    super()
   
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
    this.getProjectPlans();
  }

  getProjectPlans() {
    this.isTableLoading = true;
    this.subs.sink = this.dataService.getProjectPlans(this.user.id).subscribe({
      next: data => {
        this.dataSource.data = [...data];
        this.isTableLoading = false;
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
    })
  }


  update(data:any) {
    const Readniess = new ProjectReadiness({ 
      planId: data.planId,
      title:data.plan,
      siteId:data.siteId,
      assignTo:data.assignPgm
    });
    this.add(Readniess);
  }

NewAdd(){
 this.add(new ProjectReadiness({}));
}

add(Data:ProjectReadiness) {
  const dialogRef = this.dialog.open(ReadinessFormComponent, {
    width: '500px',
    data: {
      model:Data,
    },
  })
  dialogRef.afterClosed().subscribe((result: ProjectReadiness) => {
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

deletePlan(reg: ProjectReadiness) {
  const dialogRef = this.dialog.open(ConfirmDeleteReadineesComponent, {
    data: {
      region: reg
    }
  });
  dialogRef.afterClosed().subscribe((result: ProjectReadiness) => {
    if (result) {
      this.subs.sink = this.dataService.deletePlan(result).subscribe({
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
  const id = row.planId; 
  this.router.navigate(['/admin/project-plan/readiness-view', id]);
}

makeCopy(reg: any) {
  const dialogRef = this.dialog.open(ConfirmCopyPlanComponent, {
    data: {
      region: reg
    }
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      this.subs.sink = this.dataService.makecopyOfPaln(result).subscribe({
        next: data => {
          this.getProjectPlans();
         this.showNotification('snackbar-success', result.title + 'sucessfully Copied', 'bottom', 'center');
        },
        error: err => {
          this.errorMessage = err;
          this.showNotification('black', err, 'bottom', 'center');
        }
      })
    }
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
}
