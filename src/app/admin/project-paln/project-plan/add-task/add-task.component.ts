import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { ProjectPlanService } from '../project-plan.service';
import { ProjectPlanMainTask, ProjectPlanPhase, ProjectPlanSubTask, ProjectPlanTaskVm, StartPlan, StartPlanInfo } from '../../project-plan.model';
import { MatDialog } from '@angular/material/dialog';
import { AddNewTaskComponent } from './create-task-dialog/add-new-task/add-new-task.component';
import { number } from 'echarts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/core/models/user';
import { AddNewSubTaskComponent } from './create-task-dialog/add-new-sub-task/add-new-sub-task.component';
import { ConfirmDeleteComponent } from '../dialogs/confirm-delete/confirm-delete.component';
import { AddNewPhaseComponent } from './create-task-dialog/add-new-phase/add-new-phase.component';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { CSites, CUsers } from 'src/app/shared/common-interface/common-interface';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { ExcelService } from 'src/app/shared/common-service/excel.service';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.sass']
})
export class AddTaskComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  ProjectPlanTaskList:any[];
  ActivePlanId:number;
  data:any;
  errorMessage: any;
  sites: CSites[];
  users: CUsers[];
  HeaderConfig:any[]=[];
  startInfo:StartPlanInfo;
  isTableLoading: boolean;
  ProjectPlanTaskListExcel:any[]=[];
  constructor(
    private dataService2: CommonService, 
    private route: ActivatedRoute,
    private dataService: ProjectPlanService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private ExcelServe: ExcelService
    ) {
    super();
   this.startInfo=new StartPlanInfo({});
   }

  ngOnInit(): void {


    this.getSites(); 
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
      if(data.planInfo)
      {
         this.startInfo= new StartPlanInfo({...data.planInfo});
      }
      this.adjustSuccessorTasks(0,null,null,true);
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

addphase(Data:ProjectPlanPhase) {
  const dialogRef = this.dialog.open(AddNewPhaseComponent, {
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
 
add(Data:ProjectPlanMainTask) {
  const dialogRef = this.dialog.open(AddNewTaskComponent, {
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

addsubtask(Data:ProjectPlanSubTask) {
  const dialogRef = this.dialog.open(AddNewSubTaskComponent, {
    width: '700px',
    data: {
      model:Data,
    },
  })

  dialogRef.afterClosed().subscribe((result: ProjectPlanSubTask) => {
    if (result) {
      
      this.subs.sink = this.dataService.savesubtask(this.user.id,result).subscribe({
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
  const newTask = new ProjectPlanPhase({ 
    planId: this.ActivePlanId 
  
  });
  this.addphase(newTask);
}

Editphase(data:any){
  const newTask = new ProjectPlanPhase({ 
    planId: this.ActivePlanId,
    title:data.phaseTitle,
    duration:data.phaseDuration,
    weightage:data.phaseWeightage,
    phaseId:data.phaseId,
    displayOrder:data.displayOrder
    
  });
  this.addphase(newTask);
}

addtask(data:any){

  const newTask = new ProjectPlanMainTask({ 
    planId: this.ActivePlanId,
    phaseId:data.phaseId,
  });
  this.add(newTask);
}

Edittask(data:any){
  const newTask = new ProjectPlanMainTask({ 
    planId: this.ActivePlanId,
    taskId:data.taskId,
    title:data.title,
    duration:data.duration,
    weightage:data.weightage,
    phaseId:data.phaseId,
    idealScore:data.idealScore,
    code:data.code,
    predecessorId:data.predecessorId,
    lagDays:data.lagDays,
    predecessorType:data.predecessorType,
    durationUnit:data.durationUnit,
    lagUnit:data.lagUnit

  });
  this.add(newTask);
}

AddSubTask(data:any){
  const newTask = new ProjectPlanSubTask({
     planId: this.ActivePlanId,
     mainTaskId:data.taskId,
     phaseId:data.phaseId,
     mainTaskTitle:data.title,
    });

  this.addsubtask(newTask);
}

EditSubTask(data:any){
  const newTask = new ProjectPlanSubTask({
     planId: this.ActivePlanId,
     mainTaskId:data.taskParentId,
     mainTaskTitle:data.parentTitle,
     taskId:data.taskId,
     phaseId:data.phaseId,
     title:data.title,
     duration:data.duration,
     idealScore:data.idealScore,
     code:data.code,
     predecessorId:data.predecessorId,
     lagDays:data.lagDays,
     predecessorType:data.predecessorType,
     durationUnit:data.durationUnit,
     lagUnit:data.lagUnit,
    });

  this.addsubtask(newTask);
}



GoBackToList()
{
  this.router.navigate(['/admin/project-plan/'])
}
showNotification(colorName, text, placementFrom, placementAlign) {
  this.snackBar.open(text, "", {
    duration: 2000,
    verticalPosition: placementFrom,
    horizontalPosition: placementAlign,
    panelClass: colorName,
  });
}


deleteSubTask(obj:any){
  const data ={
    title:obj.title,
    taskId:obj.taskId
  }

  this.deletetask(data);
}


deletetask(reg:any) {
  const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
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
    title:obj.phaseTitle,
    phaseId:obj.phaseId
  }

  this.deletephasepop(data);
}


deletephasepop(reg:any) {
  const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
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



getSites() {

  this.subs.sink = this.dataService.getsites(this.user.id).subscribe({
    next: data => {
      this.sites = [...data];

    },
    error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
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
  this.subs.sink = this.dataService.saveAssignTaks(this.startInfo,this.ProjectPlanTaskList,this.user.id).subscribe({
    next: data => {
    
     this.showNotification('snackbar-success','Data Saved sucessfully', 'bottom', 'center');

    },
    error: err => {
      this.errorMessage = err;
      this.showNotification('black', err, 'bottom', 'center');
    }
  })
}

adjustSuccessorTasks(changedTaskId: number|0, newStartDate: Date| null, newEndDate: Date | null, updateAll: boolean = false) {
  let taskMap = new Map();
  this.ProjectPlanTaskList.forEach(task => {
    taskMap.set(task.taskId, task);
  });

  const updateTaskDates = (taskId: number, newStartDate: Date, newEndDate: Date) => {
    let task = taskMap.get(taskId);
    if (!task) return;
    let durationInDays = this.convertToDays(task.duration, task.durationUnit);
    let lagInDays = this.convertToDays(task.lagDays, task.lagUnit);

    durationInDays=(durationInDays > 0 ? durationInDays: 0)

    switch (task.predecessorType) {
      
      case 0: // None
      task.taskAssignmentStartDate = new Date(newStartDate);
      task.taskAssignmentEndDate = new Date(newStartDate);
      task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() +  durationInDays );
      break;
  
      case 1: // Finish-to-Start (FS)
      if (newEndDate) {
        task.taskAssignmentStartDate = new Date(newEndDate);
        task.taskAssignmentStartDate.setDate(task.taskAssignmentStartDate.getDate() + lagInDays);
        task.taskAssignmentEndDate = new Date(task.taskAssignmentStartDate);
        task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + durationInDays);
      }
        break;
    
      case 2: // Start-to-Start (SS)
        task.taskAssignmentStartDate = new Date(newStartDate);
        task.taskAssignmentStartDate.setDate(task.taskAssignmentStartDate.getDate() + lagInDays);
        task.taskAssignmentEndDate = new Date(task.taskAssignmentStartDate);
        task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + durationInDays );
        break;

      case 3: // Finish-to-Finish (FF)
        task.taskAssignmentEndDate = new Date(newEndDate);
        task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + lagInDays);
        task.taskAssignmentStartDate = new Date(task.taskAssignmentEndDate);
        task.taskAssignmentStartDate.setDate(task.taskAssignmentStartDate.getDate() - durationInDays );
        break;

      case 4: // Start-to-Finish (SF)
        task.taskAssignmentEndDate = new Date(newStartDate);
        task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + lagInDays);
        task.taskAssignmentStartDate = new Date(task.taskAssignmentEndDate);
        task.taskAssignmentStartDate.setDate(task.taskAssignmentStartDate.getDate() - durationInDays );
        break;

      default:
        console.error(`Unrecognized predecessor type ${task.predecessorType} for task ID ${task.taskId}`);
    }

    // Highlight the changed task
    const taskElement = document.querySelector(`#task-${task.taskId}`);
    if (taskElement) {
      taskElement.classList.add('changed-task');
      setTimeout(() => {
        taskElement.classList.remove('changed-task');
      }, 2000); // Remove highlight after 2 seconds
    }

    // Propagate changes to successor tasks
    this.ProjectPlanTaskList.forEach(t => {
      if (t.predecessorId === taskId) {
        if (task.taskAssignmentStartDate && task.taskAssignmentEndDate) {
          updateTaskDates(t.taskId, task.taskAssignmentStartDate, task.taskAssignmentEndDate);
        }
      }
    });
  };

  if (updateAll) {
    this.ProjectPlanTaskList
      .filter(task => task.predecessorId === -1 && task.taskId != -1 )
      .forEach(task => {
        if (task.taskAssignmentStartDate && task.taskAssignmentEndDate) {
        updateTaskDates(task.taskId, task.taskAssignmentStartDate, task.taskAssignmentEndDate);
        }
      });
  } else {
    updateTaskDates(changedTaskId, newStartDate, newEndDate);
  }
  
// Function to recursively update all child tasks first
const updateChildTasks = (taskId: number) => {
  let task = taskMap.get(taskId);
  if (!task) return;

  // Find all child tasks
  const childTasks = this.ProjectPlanTaskList.filter(t => t.taskParentId === taskId);
  
  childTasks.forEach(child => {
    // Recursively update child tasks first
    updateChildTasks(child.taskId);
    
    // Update parent task dates based on child dates
    if (child.taskAssignmentStartDate) {
      const childStartDate = new Date(child.taskAssignmentStartDate);
      if (!task.taskAssignmentStartDate || childStartDate < new Date(task.taskAssignmentStartDate)) {
        task.taskAssignmentStartDate = childStartDate;
      }
    }

    if (child.taskAssignmentEndDate) {
      const childEndDate = new Date(child.taskAssignmentEndDate);
      if (!task.taskAssignmentEndDate || childEndDate > new Date(task.taskAssignmentEndDate)) {
        task.taskAssignmentEndDate = childEndDate;
      }
    }
  });
};

// Function to update parent tasks after child tasks have been updated
const updateParentTasks = (taskId: number) => {
  let task = taskMap.get(taskId);
  if (!task) return;

  // Find all child tasks
  const childTasks = this.ProjectPlanTaskList.filter(t => t.taskParentId === taskId);
  if (childTasks.length === 0) return; // No children to process

  let minStartDate: Date | null = null;
  let maxEndDate: Date | null = null;

  childTasks.forEach(child => {
    if (child.taskAssignmentStartDate) {
      const childStartDate = new Date(child.taskAssignmentStartDate);
      if (!minStartDate || childStartDate < minStartDate) {
        minStartDate = childStartDate;
      }
    }

    if (child.taskAssignmentEndDate) {
      const childEndDate = new Date(child.taskAssignmentEndDate);
      if (!maxEndDate || childEndDate > maxEndDate) {
        maxEndDate = childEndDate;
      }
    }
  });

  // Update parent task dates
  if (task) {
    task.taskAssignmentStartDate = minStartDate || task.taskAssignmentStartDate || null;
    task.taskAssignmentEndDate = maxEndDate || task.taskAssignmentEndDate || null;
  }
};

// First pass: update all tasks from bottom to top
this.ProjectPlanTaskList.forEach(task => {
  if (task.taskId) {
    updateChildTasks(task.taskId);
  }
});

// Second pass: update parent tasks based on their updated child tasks
this.ProjectPlanTaskList.forEach(task => {
  if (task.taskParentId) {
    updateParentTasks(task.taskParentId);
  }
});

  const phases = new Map();

  this.ProjectPlanTaskList.forEach(task => {
    if (!phases.has(task.phaseId)) {
      phases.set(task.phaseId, {
        minStartDate: null,
        maxEndDate: null
      });
    }

    const phase = phases.get(task.phaseId);
    if (task.taskAssignmentStartDate) {
      const taskStartDate = new Date(task.taskAssignmentStartDate);
      if (!phase.minStartDate || taskStartDate < phase.minStartDate) {
        phase.minStartDate = taskStartDate;
      }
    }

    if (task.taskAssignmentEndDate) {
      const taskEndDate = new Date(task.taskAssignmentEndDate);
      if (!phase.maxEndDate || taskEndDate > phase.maxEndDate) {
        phase.maxEndDate = taskEndDate;
      }
    }
  });

  this.ProjectPlanTaskList.forEach(phase => {
    if (phases.has(phase.phaseId)) {
      const phaseDates = phases.get(phase.phaseId);
      phase.phaseStartDate = phaseDates.minStartDate || null;
      phase.phaseEndDate = phaseDates.maxEndDate || null;
    }
  });
}

// Call this function when the date changes
UpdateTaskDatesOnChangeOftask (task: any, dateType: 'start' | 'end') {
  if (dateType === 'start') {
    this.adjustSuccessorTasks(task.taskId, task.taskAssignmentStartDate, task.taskAssignmentEndDate);
  } else if (dateType === 'end') {
    this.adjustSuccessorTasks(task.taskId, task.taskAssignmentStartDate, task.taskAssignmentEndDate);
  }
}

convertToDays(duration, unit) {
  switch (unit) {
      case 1:
          return duration;
      case 2: // Weeks
          return duration * 7;
      case 3: // Months
          return duration * 30; 
      case 4: // Years
          return duration * 365; 
      default:
          return duration; 
  }



}

Export(){
  this.HeaderConfig=[
    {key:'code',label:"Code"},
    {key:'phaseTitle',label:"Phase"},
    {key:'phaseStartDate',label:"Phase Start Date"},
    {key:'phaseEndDate',label:"Phase End Date"},
    {key:'title',label:"Task"},
    {key:'taskAssignmentStartDate',label:"Start Date"},
    {key:'taskAssignmentEndDate',label:"End Date"},
  ]
  this.ProjectPlanTaskListExcel.length=0;
   const hierarchicalTasks = this.buildHierarchy(this.ProjectPlanTaskList);
   const flattenedTasks = this.flattenHierarchy(hierarchicalTasks);
   this.ProjectPlanTaskListExcel = this.formatDatesInList(flattenedTasks);

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
    return {
      ...task,
       taskAssignmentStartDate: this.formatDateForBackend(new Date(task.taskAssignmentStartDate )),
       taskAssignmentEndDate: this.formatDateForBackend(new Date(task.taskAssignmentEndDate)) ,
       phaseStartDate: this.formatDateForBackend(new Date(task.phaseStartDate )),
       phaseEndDate: this.formatDateForBackend(new Date(task.phaseEndDate))
    };

  });
}
formatDateForBackend(date: Date): string {
  return formatDate(date, 'yyyy-MM-dd', 'en-US');
}
}
