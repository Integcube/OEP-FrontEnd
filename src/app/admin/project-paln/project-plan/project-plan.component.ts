import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectPhase, ProjectPlan } from '../project-plan.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanFormComponent } from './dialogs/plan-form.component';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { User } from 'src/app/core/models/user';
import { ConfirmDeleteComponent } from './dialogs/confirm-delete/confirm-delete.component';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ConfirmCopyPlanComponent } from './dialogs/confirm-copyPlan/confirm-copyPlan.component';
import { ProjectPlanService } from './project-plan.service';


@Component({
  selector: 'app-project-plan',
  templateUrl: './project-plan.component.html',
  styleUrls: ['./project-plan.component.sass']
})
export class ProjectPlanComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  dataSource: MatTableDataSource<ProjectPlan>;
  isTableLoading: boolean;
  displayedColumns: string[] = ['planId', 'title','site','assignTo','startDate','user','createdOn', 'actions'];
  userForm: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  errorMessage: any;
 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 
  constructor(
    private dataService: ProjectPlanService,
    private dataService2: CommonService, 
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
    
    ) { super() }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<ProjectPlan>();
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

  update(Data:ProjectPlan) {
    this.add(Data);
  }

NewAdd(){
 this.add(new ProjectPlan({}));
}

  add(Data:ProjectPlan) {
    const dialogRef = this.dialog.open(PlanFormComponent, {
      width: '500px',
      data: {
        model:Data,
      },
    })

    dialogRef.afterClosed().subscribe((result: ProjectPlan) => {
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

  deletePlan(reg: ProjectPlan) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        region: reg
      }
    });
    dialogRef.afterClosed().subscribe((result: ProjectPlan) => {
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

  makeCopy(reg: ProjectPlan) {
    const dialogRef = this.dialog.open(ConfirmCopyPlanComponent, {
      data: {
        region: reg
      }
    });
    dialogRef.afterClosed().subscribe((result: ProjectPlan) => {
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


  AddTask(row: any) {
    const id = row.planId; 
    this.router.navigate(['/admin/project-plan/add-task', id]);
  }

}
