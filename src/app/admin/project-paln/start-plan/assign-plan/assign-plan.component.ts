import { Component, DebugNode, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { CSites, CUsers } from 'src/app/shared/common-interface/common-interface';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { StartPlanService } from '../start-plan.service';
import { User } from 'src/app/core/models/user';
import { StartPlan } from '../../project-plan.model';
import { number } from 'echarts';

@Component({
  selector: 'app-assign-plan',
  templateUrl: './assign-plan.component.html',
  styleUrls: ['./assign-plan.component.sass']
})

export class AssignPlanComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  sites: CSites[];
  users: CUsers[];
  plans: any[];
  ProjectPlanTaskList:any[]
  errorMessage:any;
  startplan:StartPlan;
  StartPlanId:number;
  isTableLoading: boolean;
  constructor(
 private route: ActivatedRoute,
  private dataService: StartPlanService,
  private dataService2: CommonService, 
  private snackBar: MatSnackBar,
  public dialog: MatDialog,
  private router: Router
  
  ) { 
    super() 

    this.startplan = new StartPlan({});
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
    this.subs.sink = this.dataService.getPlanTask(1,StartPlanId,).subscribe({
      next: data => {
        this.ProjectPlanTaskList  = [...data.results];
        if(data.planInfo)
        {
          this.startplan= new StartPlan({...data.planInfo});
        }
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

SetTaksDates(startDate: any) {
  debugger
  const phaseTasks = this.ProjectPlanTaskList.filter(task => task.isChild === 0);
  if (phaseTasks.length === 0) return;

  let taskMap = new Map();
  phaseTasks.forEach(task => {
      taskMap.set(task.taskId, task);
  });

  let currentStartDate = new Date(startDate.value);

  phaseTasks.forEach(task => {
      if (task.predecessorId === -1) {
          task.taskAssignmentStartDate = new Date(currentStartDate);
          task.taskAssignmentEndDate = new Date(currentStartDate);
          let durationInDays = this.convertToDays(task.duration, task.durationUnit);
          task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + durationInDays);
      } else {
       
          let predecessorTask = taskMap.get(task.predecessorId);
          if (predecessorTask) {
            let taskStartDate, taskEndDate;
            let lagInDays = this.convertToDays(task.lagDays, task.lagUnit);

            switch (task.predecessorType) {
                case 1: // Finish-to-Start (FS)
                    taskStartDate = new Date(predecessorTask.taskAssignmentEndDate);
                    taskStartDate.setDate(taskStartDate.getDate() + lagInDays);
                    task.taskAssignmentStartDate = new Date(taskStartDate);
                    taskEndDate = new Date(taskStartDate);
                    taskEndDate.setDate(taskEndDate.getDate() + this.convertToDays(task.duration, task.durationUnit));
                    task.taskAssignmentEndDate = new Date(taskEndDate);
                    break;

                case 2: // Start-to-Start (SS)
                    taskStartDate = new Date(predecessorTask.taskAssignmentStartDate);
                    taskStartDate.setDate(taskStartDate.getDate() + lagInDays);
                    task.taskAssignmentStartDate = new Date(taskStartDate);
                    taskEndDate = new Date(taskStartDate);
                    taskEndDate.setDate(taskEndDate.getDate() + this.convertToDays(task.duration, task.durationUnit));
                    task.taskAssignmentEndDate = new Date(taskEndDate);
                    break;

                case 3: // Finish-to-Finish (FF)
                    taskEndDate = new Date(predecessorTask.taskAssignmentEndDate);
                    taskEndDate.setDate(taskEndDate.getDate() + lagInDays);
                    task.taskAssignmentEndDate = new Date(taskEndDate);
                    taskStartDate = new Date(taskEndDate);
                    taskStartDate.setDate(taskStartDate.getDate() - this.convertToDays(task.duration, task.durationUnit));
                    task.taskAssignmentStartDate = new Date(taskStartDate);
                    break;

                case 4: // Start-to-Finish (SF)
                    taskEndDate = new Date(predecessorTask.taskAssignmentStartDate);
                    taskEndDate.setDate(taskEndDate.getDate() + lagInDays);
                    task.taskAssignmentEndDate = new Date(taskEndDate);
                    taskStartDate = new Date(taskEndDate);
                    taskStartDate.setDate(taskStartDate.getDate() - this.convertToDays(task.duration, task.durationUnit));
                    task.taskAssignmentStartDate = new Date(taskStartDate);
                    break;

                default:
                    console.error(`Unrecognized predecessor type ${task.predecessorType} for task ID ${task.taskId}`);
            }
        }  else {
          console.error(`Predecessor task with ID ${task.predecessorId} not found`);
      }
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

adjustSuccessorTasks(changedTaskId: number, newStartDate: Date, newEndDate: Date) {
  debugger
  let taskMap = new Map();
  this.ProjectPlanTaskList.forEach(task => {
    taskMap.set(task.taskId, task);
  });

  const updateTaskDates = (taskId: number, newStartDate: Date, newEndDate: Date) => {
    let task = taskMap.get(taskId);
    if (!task) return;

    let durationInDays = this.convertToDays(task.duration, task.durationUnit);
    let lagInDays = this.convertToDays(task.lagDays, task.lagUnit);

    switch (task.predecessorType) {
      case 1: // Finish-to-Start (FS)
        task.taskAssignmentStartDate = new Date(newEndDate);
        task.taskAssignmentStartDate.setDate(task.taskAssignmentStartDate.getDate() + lagInDays);
        task.taskAssignmentEndDate = new Date(task.taskAssignmentStartDate);
        task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + durationInDays);
        break;

      case 2: // Start-to-Start (SS)
        task.taskAssignmentStartDate = new Date(newStartDate);
        task.taskAssignmentStartDate.setDate(task.taskAssignmentStartDate.getDate() + lagInDays);
        task.taskAssignmentEndDate = new Date(task.taskAssignmentStartDate);
        task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + durationInDays);
        break;

      case 3: // Finish-to-Finish (FF)
        task.taskAssignmentEndDate = new Date(newEndDate);
        task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + lagInDays);
        task.taskAssignmentStartDate = new Date(task.taskAssignmentEndDate);
        task.taskAssignmentStartDate.setDate(task.taskAssignmentStartDate.getDate() - durationInDays);
        break;

      case 4: // Start-to-Finish (SF)
        task.taskAssignmentEndDate = new Date(newStartDate);
        task.taskAssignmentEndDate.setDate(task.taskAssignmentEndDate.getDate() + lagInDays);
        task.taskAssignmentStartDate = new Date(task.taskAssignmentEndDate);
        task.taskAssignmentStartDate.setDate(task.taskAssignmentStartDate.getDate() - durationInDays);
        break;

      default:
        console.error(`Unrecognized predecessor type ${task.predecessorType} for task ID ${task.taskId}`);
    }
debugger
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
        updateTaskDates(t.taskId, task.taskAssignmentStartDate, task.taskAssignmentEndDate);
      }
    });
  };

  updateTaskDates(changedTaskId, newStartDate, newEndDate);

  // Recalculate phase start and end dates after adjustments
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
  saveAssignTasks(){
    this.subs.sink = this.dataService.saveAssignTaks(this.startplan,this.ProjectPlanTaskList,this.user.id).subscribe({
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
    this.router.navigate(['/admin/project-plan/start-plan'])
  }




}
