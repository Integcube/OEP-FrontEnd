import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { ProjectPlan } from '../project-plan.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { User } from 'src/app/core/models/user';
import { StartPlanService } from './start-plan.service';

@Component({
  selector: 'app-start-plan',
  templateUrl: './start-plan.component.html',
  styleUrls: ['./start-plan.component.sass']
})
  export class StartPlanComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    user: User = JSON.parse(localStorage.getItem('currentUser'));
    dataSource: MatTableDataSource<any>;
    isTableLoading: boolean;
    displayedColumns: string[] = ['id', 'plan','site', 'assignTo','user','startDate','createdOn', 'actions'];
    userForm: FormGroup;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    errorMessage: any;
    constructor(
      private dataService: StartPlanService,
      private dataService2: CommonService, 
      private snackBar: MatSnackBar,
      public dialog: MatDialog,
      private router: Router
      
      ) { super() }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>;
    this.getProjectPlans();
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

  getProjectPlans() {
    this.isTableLoading = true;
    this.subs.sink = this.dataService.getProjectPlans().subscribe({
      next: data => {
        this.dataSource.data = [...data];
        this.isTableLoading = false;
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
    })
  }
  NewAdd(){
    this.router.navigate(['/admin/project-plan/assign-plan', -1]);
   }
   EditPlan(row: any) {
    const id = row.id; 
    this.router.navigate(['/admin/project-plan/assign-plan/', id]);
  }
}
