import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { CSites, CUsers } from 'src/app/shared/common-interface/common-interface';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { PgmAssignTaskService } from '../pgm-assign-task.service';
import { User } from 'src/app/core/models/user';
import { StartPlan, StartPlanInfo } from '../../project-plan.model';


@Component({
  selector: 'app-assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.sass'],
})

export class AssignTaskComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  sites: CSites[];
  users: CUsers[];
  plans: any[];
  ProjectPlanTaskList:any[]
  errorMessage:any;

  StartPlanId:number;
  startInfo:StartPlanInfo;
  isTableLoading:boolean;
  constructor(
 private route: ActivatedRoute,
  private dataService: PgmAssignTaskService,
  private dataService2: CommonService, 
  private snackBar: MatSnackBar,
  public dialog: MatDialog,
  private router: Router
  
  ) { 
    super() 

    this.startInfo = new StartPlanInfo({});
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getPlanTask(id);
        this.StartPlanId=+id;
      }
    
    });
    this.getSites();
    this.getusers();
    this.getplans();
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

  getplans() {

    this.subs.sink = this.dataService.getplans().subscribe({
      next: data => {
        this.plans = [...data];
 
      },
      error: err => { this.errorMessage = err; this.showNotification('black', err, 'bottom', 'center') },
    })
  }
  
  onPlanChange(selectedPlanId: any): void {
    console.log('Selected plan ID:', selectedPlanId);
   
  }


  getPlanTask(StartPlanId) {
    this.isTableLoading=true;
    this.subs.sink = this.dataService.getPlanTask(StartPlanId,).subscribe({
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

//   SetTaksDates(startDate: any)  {

//     const phaseTasks = this.ProjectPlanTaskList.filter(task => task.isChild === 0);
//     if (phaseTasks.length === 0) return;

//     let taskMap = new Map();
//     phaseTasks.forEach(task => {
//         taskMap.set(task.taskId, task);
//     });

//     let currentStartDate = new Date(startDate.value);

//     phaseTasks.forEach(task => {
//         if (task.predecessorId == -1) {
//             task.taskAssignmentStartDate = new Date(currentStartDate);
//             task.taskAssignmentEndDate = new Date(currentStartDate);
//             task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + task.duration);
//         } else {
//             let predecessorTask = taskMap.get(task.predecessorId);
//             if (predecessorTask) {
//                 var predecessorEndDate = new Date(predecessorTask.taskAssignmentEndDate);
//                 var taskStartDate = new Date(predecessorEndDate);
//                 taskStartDate.setDate(taskStartDate.getDate() + task.lagDays);
//                 task.taskAssignmentStartDate = new Date(taskStartDate);
//                 task.taskAssignmentEndDate = new Date(taskStartDate);
//                 task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + task.duration);
       

//             } else {
//                 console.error(`Predecessor task with ID ${task.predecessorId} not found`);
//             }
//         }
//     });
// }


adjustSuccessorTasks(changedTaskId: number|0, newStartDate: Date| null, newEndDate: Date | null, updateAll: boolean = false) {

  let taskMap = new Map();
  this.ProjectPlanTaskList.forEach(task => {
    taskMap.set(task.taskId, task);
  });

  // Recursive function to update parent tasks
  const updateParentTaskDates = (taskId: number) => {
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

      updateParentTaskDates(child.taskId);
    });

    // Update parent task dates
    if (task) {
      task.taskAssignmentStartDate = minStartDate || task.taskAssignmentStartDate || null;
      task.taskAssignmentEndDate = maxEndDate || task.taskAssignmentEndDate || null;
    }
  };

  this.ProjectPlanTaskList.forEach(task => {
    if (task.taskParentId) {
  
      updateParentTaskDates(task.taskParentId);
    }
  });

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

  // updateTaskDates(phase) {
  //   const phaseTasks = this.ProjectPlanTaskList.filter(task => task.phaseId === phase.phaseId && task.isChild === 0);
  //   if (phaseTasks.length === 0) return;

  //   let currentStartDate = new Date(phase.phaseStartDate);
  //   phaseTasks.forEach(task => {
  //     task.taskAssignmentStartDate = new Date(currentStartDate);
  //     task.taskAssignmentEndDate = new Date(currentStartDate);
  //     task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + task.duration);
  //     currentStartDate = new Date(task.taskAssignmentEndDate);
  //     currentStartDate.setDate(currentStartDate.getDate() + 1);
  //   });
  // }

  updateTaskPgms(phaseId: number, phasePgmId: number) {
    this.ProjectPlanTaskList = this.ProjectPlanTaskList.map(task => task.phaseId === phaseId ? { ...task, assignTo: phasePgmId } : task
    );
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


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  GoBackToList()
  {
    this.router.navigate(['/admin/project-plan/pgm-assign-task'])
  }




}
