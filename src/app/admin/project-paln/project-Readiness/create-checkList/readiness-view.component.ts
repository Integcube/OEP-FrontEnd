import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { ProjectPlanMainTask, ProjectPlanPhase, ProjectPlanSubTask, ProjectPlanTaskVm, StartPlan, StartPlanInfo } from '../../project-plan.model';
import { DialogPosition, MatDialog } from '@angular/material/dialog';

import { number } from 'echarts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/core/models/user';

import { ConfirmDeleteReadineesComponent } from '../dialogs/confirm-delete/confirm-delete.component';

import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { CSites, CUsers } from 'src/app/shared/common-interface/common-interface';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { ExcelService } from 'src/app/shared/common-service/excel.service';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { ProjectReadinessService } from '../project-readiness.service';

import { ReadinessNewTaskComponent } from './readiness-new-task/readiness-new-task.component';
import { DocInfo, ProjectReadinessPhase, ProjectReadinessTask, ReadinessInfo } from '../project-Readiness.model';
import { FileUploadDialogComponent } from '../../file-upload-dialog/file-upload-dialog.component';
import { FileUploadDialogReadinessComponent } from '../file-upload-dialog/file-upload-dialog.component';
import { ReadineesPhasePhaseComponent } from './add-new-phase/Readinees-phase.component';

@Component({
  selector: 'app-readiness-view',
  templateUrl: './readiness-view.component.html',
  styleUrls: ['./readiness-view.component.sass']
})
export class ReadinessViewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  ProjectPlanTaskList:any[];
  ActivePlanId:number;
  data:any;
  errorMessage: any;
  sites: CSites[];
  users: CUsers[];
  HeaderConfig:any[]=[];
  startInfo:ReadinessInfo;
  isTableLoading: boolean;
  ProjectPlanTaskListExcel:any[]=[];
  action: DocInfo;
  constructor(
    private dataService2: CommonService, 
    private route: ActivatedRoute,
    private dataService: ProjectReadinessService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private ExcelServe: ExcelService
    ) {
    super();
   this.startInfo=new ReadinessInfo({});
   this.action = new DocInfo({});
   }

  ngOnInit(): void {
    this.getusers();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getPlanTask(id);
        this.ActivePlanId=+id;
      }
    
    });
  }

  getPlanTask(PlanID) {
    this.isTableLoading=true;
  this.subs.sink = this.dataService.getPlanTask(PlanID).subscribe({
    next: data => {
      this.ProjectPlanTaskList  = [...data.results];
      this.startInfo=  data.planInfo;
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

addphase(Data:ProjectReadinessPhase) {
  const dialogRef = this.dialog.open(ReadineesPhasePhaseComponent, {
    width: '700px',
    data: {
      model:Data,
    },
  })

  dialogRef.afterClosed().subscribe((result: ProjectPlanPhase) => {
    if (result) {
      this.subs.sink = this.dataService.savephase(this.user.id,result).subscribe({
        next: data => {
        this.getPlanTask(result.planId);
         this.showNotification('snackbar-success','Task Saved sucessfully', 'bottom', 'center');

        },
        error: err => {
          
          this.showNotification('black', err, 'bottom', 'center');
        }
      })
    }
  })

}
 
add(Data:ProjectReadinessTask) {
  const dialogRef = this.dialog.open(ReadinessNewTaskComponent, {
    width: '700px',
    data: {
      model:Data,
    },
  })

  dialogRef.afterClosed().subscribe((result: ProjectPlanMainTask) => {
    if (result) {
      this.subs.sink = this.dataService.savemanintask(this.user.id,result).subscribe({
        next: data => {
        this.getPlanTask(result.planId);
         this.showNotification('snackbar-success','Task Saved sucessfully', 'bottom', 'center');
         
        },
        error: err => {
          
          this.showNotification('black', err, 'bottom', 'center');
        }
      })
    }
  })
}

addNewPhase(){
  const newTask = new ProjectReadinessPhase({ 
    planId: this.ActivePlanId 
  
  });
  this.addphase(newTask);
}

Editphase(data:any){

  const newTask = new ProjectReadinessPhase({ 
    planId: this.ActivePlanId,
    title:data.phasetitle,
    weightage:data.phaseweightage,
    phaseId:data.phaseId,
    displayOrder:data.displayOrder
  });
  this.addphase(newTask);
}

addtask(data:any){

  const newTask = new ProjectReadinessTask({ 
    planId: this.ActivePlanId,
    phaseId:data.phaseId,
  });
  this.add(newTask);
}

Edittask(data:any){
  const newTask = new ProjectReadinessTask({ 
    planId: this.ActivePlanId,
    taskId:data.taskId,
    title:data.tasktitle,
    weightage:data.weightage,
    phaseId:data.phaseId,
    idealScore:data.idealScore,
    actualScore:data.actualScore,
    responsibility:data.responsibility,
    targetdate:data.targetdate,
    remarks:data.remarks,
  });
  this.add(newTask);
}

GoBackToList()
{
  this.router.navigate(['/admin/project-plan/project-Readiness'])
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
  const dialogRef = this.dialog.open(ConfirmDeleteReadineesComponent, {
    data: {
      region: reg
    }
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      this.subs.sink = this.dataService.deletetask(result.taskId,this.user.id).subscribe({
        next: data => {
          this.getPlanTask(this.ActivePlanId);
         this.showNotification('snackbar-success', result.title + ' has been deleted sucessfully', 'bottom', 'center');
        },
        error: err => {
          this.showNotification('black', err, 'bottom', 'center');
        }
      })
    }
  })
}

deletephase(obj:any){
  const data ={
    plan:obj.phasetitle,
    phaseId:obj.phaseId
  }

  this.deletephasepop(data);
}


deletephasepop(reg:any) {
  const dialogRef = this.dialog.open(ConfirmDeleteReadineesComponent, {
    
    data: {
      region: reg
    }
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      this.subs.sink = this.dataService.deletephase(result.phaseId,this.user.id).subscribe({
        next: data => {
          this.getPlanTask(this.ActivePlanId);
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

saveAssignTasks(){
  // this.subs.sink = this.dataService.saveAssignTaks(this.startInfo,this.ProjectPlanTaskList,this.user.id).subscribe({
  //   next: data => {
    
  //    this.showNotification('snackbar-success','Data Saved sucessfully', 'bottom', 'center');

  //   },
  //   error: err => {
  //     this.errorMessage = err;
  //     this.showNotification('black', err, 'bottom', 'center');
  //   }
  // })
}


uploadEvidence(Type) {
  debugger
  this.action.siteId=this.startInfo.siteId;
  this.action.Date=new Date(),
  this.action.type=1;
  this.action.taskId=Type.taskId;
  const dialogPosition: DialogPosition = {
    right: 30 + 'px'
  };
  const dialogRef = this.dialog.open(FileUploadDialogReadinessComponent, {
    panelClass: 'custom-dialog-container',
    width: '340px',
    height: '700px',
    position: dialogPosition,
    data: {
      data: this.action,
      action: 'outageTracker',
      mode: 'edit'
    },
  });
}

Export(){
  this.HeaderConfig=[
    {key:'phasetitle',label:"Phase"},
    {key:'phaseweightage',label:"Weightage"},
    {key:'tasktitle',label:"Task"},
    {key:'idealScore',label:"Ideal Score"},
    {key:'actualScore',label:"Actual Score"},
    {key:'elementScore',label:"ElementScore"},
    {key:'username',label:"Responsibility"},
    {key:'targetdate',label:"targetdate"},
    {key:'remarks',label:"Remarks"},
    
  ]
  this.ProjectPlanTaskListExcel.length=0;
  //  const hierarchicalTasks = this.buildHierarchy(this.ProjectPlanTaskList);
  //  const flattenedTasks = this.flattenHierarchy(hierarchicalTasks);
   this.ProjectPlanTaskListExcel = this.formatDatesInList(this.ProjectPlanTaskList);

   this.ExcelServe.exportToExcel(this.ProjectPlanTaskListExcel, this.HeaderConfig, 'PlanTaskList.xlsx');
      
    }

 buildHierarchy(tasks: any[]): any[] {
  const taskMap = new Map<number, any>();
  tasks.forEach(task => {
    taskMap.set(task.taskId, { ...task, children: [] });
  });

  const hierarchy: any[] = [];
  taskMap.forEach(task => {
    if (task.taskParentId === -1) {
      hierarchy.push(task);
    } else {
      const parent = taskMap.get(task.taskParentId);
      if (parent) {
        parent.children.push(task);
      }
    }
  });

  return hierarchy;
}

 flattenHierarchy(hierarchy: any[], level: number = 0): any[] {
  const result: any[] = [];

  hierarchy.forEach(task => {
    result.push({ ...task,isParent: task.taskParentId === -1, level });
    if (task.children && task.children.length) {
      result.push(...this.flattenHierarchy(task.children, level + 1));
    }
  });

  return result;
}
formatDatesInList(taskList: any[]): any[] {
  return taskList.map(task => {
    if (task.targetdate !== null && task.targetdate !== undefined) {
      return {
        ...task,
        targetdate: this.formatDateForBackend(new Date(task.targetdate)),
      };
    }
    return task; 
  });
}

formatDateForBackend(date: Date): string {
  return formatDate(date, 'yyyy-MM-dd', 'en-US');
}
}
