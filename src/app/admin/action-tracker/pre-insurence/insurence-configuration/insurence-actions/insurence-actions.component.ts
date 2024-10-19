import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DialogPosition, MatDialog } from '@angular/material/dialog';

import { number } from 'echarts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/core/models/user';


import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { CSites, CUsers } from 'src/app/shared/common-interface/common-interface';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { ExcelService } from 'src/app/shared/common-service/excel.service';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { PreInsurenceService } from '../pre-insurence.service';
import { PreInsurencActionComponent } from './pre-insurence-action/pre-insurence-action.component';
import { PreInsurenceAction } from '../pre-insurenc.model';
import { ConfirmDeleteComponent } from '../../../regions/region-main/dialogs/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-insurence-actions',
  templateUrl: './insurence-actions.component.html',
  styleUrls: ['./insurence-actions.component.sass']
})
export class InsurenceActionsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  ProjectPlanTaskList:any[];
  ActivePlanId:number;
  data:any;
  errorMessage: any;
  sites: CSites[];
  users: CUsers[];
  HeaderConfig:any[]=[];
  startInfo:any;
  isTableLoading: boolean;
  ProjectPlanTaskListExcel:any[]=[];
  evidenceList:any[]=[];

  constructor(
    private dataService2: CommonService, 
    private route: ActivatedRoute,
    private dataService: PreInsurenceService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private ExcelServe: ExcelService
    ) {
    super();

   }

  ngOnInit(): void {
    this.getusers();
    this.getActionData();

  }

  getActionData() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.ActivePlanId=+id;
      }
    });

  this.isTableLoading=true;
  this.subs.sink = this.dataService.getActionData( this.ActivePlanId).subscribe({
    next: data => {
      this.ProjectPlanTaskList  = [...data.data2];
      this.startInfo=  data.data1;
    
      this.isTableLoading=false;
    }
  
  })
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  // this.dataSource.filter = filterValue.trim().toLowerCase();
  // if (this.dataSource.paginator) {
  //   this.dataSource.paginator.firstPage();
  // }
}

addAction(Data:any) {
  const dialogRef = this.dialog.open(PreInsurencActionComponent, {
    width: '700px',
    data: {
      model:Data,
    },
  })

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      this.subs.sink = this.dataService.saveAction(this.user.id,result).subscribe({
        next: data => {
          this.getActionData();
         this.showNotification('snackbar-success','Task Saved sucessfully', 'bottom', 'center');
        },
        error: err => {
          
          this.showNotification('black', err, 'bottom', 'center');
        }
      })
    }
  })
}
 
addNew(){
   const newTask = new PreInsurenceAction({ 
    preInsuranceId: this.ActivePlanId 
  
  });
 this.addAction(newTask);
}

EditAction(data:any){
  const newTask = new PreInsurenceAction({ 
    preInsuranceId: this.ActivePlanId,
    title:data.title,
    preInsuranceActionId:data.preInsuranceActionId,
    evidenceType:data.evidenceType,
    guidelines:data.guidelines,
    additionalGuidelines:data.additionalGuidelines
  });
  this.addAction(newTask);
}



GoBackToList()
{
  this.router.navigate(['/admin/action-tracker/pre-Insurence/'])
}
showNotification(colorName, text, placementFrom, placementAlign) {
  this.snackBar.open(text, "", {
    duration: 2000,
    verticalPosition: placementFrom,
    horizontalPosition: placementAlign,
    panelClass: colorName,
  });
}

deletetask(reg:any) {
  const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
    data: {
      region: reg
    }
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      this.subs.sink = this.dataService.deleteAction(result.preInsuranceActionId).subscribe({
        next: data => {
          this.getActionData();
         this.showNotification('snackbar-success', result.title + ' has been deleted sucessfully', 'bottom', 'center');
        },
        error: err => {
          this.showNotification('black', err, 'bottom', 'center');
        }
      })
    }
  })
}





getusers() {

  this.subs.sink = this.dataService2.getUsers(-1,-1,-1).subscribe({
    next: data => {
      const defaultUser = {
        userId: -1,
        userName: '-Select-',
        name: '-Select-',
        email: '-Select-',
        isSelected: false
      };
      this.users = [defaultUser, ...data];

    },
    error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
  })
}



}
