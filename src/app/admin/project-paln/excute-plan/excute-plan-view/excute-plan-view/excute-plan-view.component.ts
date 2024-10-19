import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/user';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { CSites, CUsers } from 'src/app/shared/common-interface/common-interface';
import { CommonService } from 'src/app/shared/common-service/common.service';
import { StartPlan } from '../../../project-plan.model';
import { StartPlanService } from '../../../start-plan/start-plan.service';
import { ExcuteplanService } from '../../excute-plan.service';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/shared/common-service/excel.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-excute-plan-view',
  templateUrl: './excute-plan-view.component.html',
  styleUrls: ['./excute-plan-view.component.sass']
})
  export class ExcutePlanViewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    user: User = JSON.parse(localStorage.getItem('currentUser'));
    plans: any[];
    ProjectPlanTaskList:any[]
    errorMessage:any;
    percentages: number[] = [];
    StartPlanId:number;
    SiteName:any;
    region:any;
    startDate:any;
    Yearlist:any[]=[];
    year:any[]=[];
    HeaderConfig:any[]=[];
    isTableLoading:boolean;
    ProjectPlanTaskListExcel:any[]=[];
    TotalCompletePlan:any;
    constructor(
    private route: ActivatedRoute,
    private dataService: ExcuteplanService,
    private dataService2: CommonService, 
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private ExcelServe: ExcelService
    ) { 
      super() 
  
    }

  ngOnInit(): void {
 
    for (let i = 0; i <= 100; i++) {
      this.percentages.push(i);
    }
    this.getPlanTask();


  }
  getPlanTask() {
    this.isTableLoading=true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.StartPlanId=+id;
      }
    
    });
  
    this.subs.sink = this.dataService.getPlanTask(this.user.id,this.StartPlanId,this.year).subscribe({
      next: data => {
        this.ProjectPlanTaskList  = [...data.results];
       
        if (this.ProjectPlanTaskList.length > 0) 
          this.TotalCompletePlan = this.ProjectPlanTaskList[0].totalCompletePlan;
        else
        this.TotalCompletePlan=0;

        this.SiteName=[data.planInfo.site];
        this.region=[data.planInfo.region];
        this.startDate=[data.planInfo.startDate];

        let minDate = null;
        let maxDate = null;
        if (this.ProjectPlanTaskList.length > 0) {
          if (this.ProjectPlanTaskList[0]?.minTaskStartDate && this.ProjectPlanTaskList[0]?.minTaskStartDate.length > 0) {
              minDate = new Date(this.ProjectPlanTaskList[0].minTaskStartDate);
          }
  
          if (this.ProjectPlanTaskList[0]?.maxTaskEndDate && this.ProjectPlanTaskList[0]?.maxTaskEndDate.length > 0) {
              maxDate = new Date(this.ProjectPlanTaskList[0].maxTaskEndDate);
          }

         if(this.Yearlist.length==0){
          this.generateMonthYearList(minDate, maxDate);
         }
      
      }
      this.adjustSuccessorTasks();
      this.isTableLoading=false;
      }
    
    
    })
  
  }
 formatDateForBackend(date: Date): string {
  return formatDate(date, 'yyyy-MM-dd', 'en-US');
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
  Export(){

    this.HeaderConfig=[
      {key:'code',label:"Code"},
      {key:'phaseTitle',label:"Phase"},
      {key:'title',label:"Task"},
      {key:'taskAssignmentStartDate',label:"Start Date"},
      {key:'taskAssignmentEndDate',label:"End Date"},
      {key:'assignToName',label:"Assign To"},
      {key:'completionProgress',label:"Plan Progress"},
      {key:'progress',label:"Actual Progress"},
   
    ]
    this.ProjectPlanTaskListExcel.length=0;
    const hierarchicalTasks = this.buildHierarchy(this.ProjectPlanTaskList);
    const flattenedTasks = this.flattenHierarchy(hierarchicalTasks);
    this.ProjectPlanTaskListExcel = this.formatDatesInList(flattenedTasks);
        this.ExcelServe.exportToExcel(this.ProjectPlanTaskListExcel,this.HeaderConfig,'ExcutedTaskList.xlsx')
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

  generateMonthYearList(minDate: Date, maxDate: Date) {
   let currentDate = new Date();
   let allMonths = [];
    while (currentDate <= maxDate) {
      let monthYearString = this.getMonthYearString(currentDate);
      allMonths.push({
        date: monthYearString,
        isSelected: false
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const now = new Date();
    const currentMonthYearString = this.getMonthYearString(now);
  
    // Reorder the list so that the current month-year is on top
    this.Yearlist = allMonths.sort((a, b) => {
      if (a.date === currentMonthYearString) return -1;
      if (b.date === currentMonthYearString) return 1;
      return 0;
    });

  // Mark the current month-year as selected
  if (this.Yearlist.length > 0 && this.Yearlist[0].date === currentMonthYearString) {
  this.yearListFn(this.Yearlist[0]);
    this.Yearlist[0].isSelected = true;
}
  }
  getMonthYearString(date: Date): string {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    return `${month}-${year}`;
  }

  

  filterFn()
  {
    this.getPlanTask();
  }
  clearFn() {
    this.year.length=0;
    this.Yearlist.map(a=>a.isSelected = false);
  }

  //Filters
  yearListFn(year:any){
  
    this.clearFn();
    let index = this.year.indexOf(year.date);
    if (index == -1) {
      this.year.push(year.date);
    }
    else {
      this.year.splice(index, 1);
    }
  }
  GoBackToList()
  {
    this.router.navigate(['/admin/project-plan/excute-plan'])
  }
  saveAssignTasks(){
    this.subs.sink = this.dataService.saveProgress(this.ProjectPlanTaskList,this.user.id).subscribe({
      next: data => {
       this.showNotification('snackbar-success','Data Saved sucessfully', 'bottom', 'center');
       this. getPlanTask();
      },
      error: err => {
        this.errorMessage = err;
        this.showNotification('black', err, 'bottom', 'center');
      }
    })
  }

  adjustSuccessorTasks() {

    let taskMap = new Map();
    this.ProjectPlanTaskList.forEach(task => {
      taskMap.set(task.taskId, task);
    });

  function calculateCumulativeProgress(start: Date, end: Date,currentDate: Date): number {
const startDate =new Date(start);
const endDate =new Date(end);
if (!startDate || !endDate) {
    console.error('Invalid date input. Start date and end date are required.');
    return 0; // or any default value you prefer
}
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Function to calculate the number of days in a month within the task's duration
    function getDaysInRangeOfMonth(year: number, month: number): number {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Adjust the task range to be within the given month
        const start = startDate > firstDayOfMonth ? startDate : firstDayOfMonth;
        const end = endDate < lastDayOfMonth ? endDate : lastDayOfMonth;

        return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    }

    function calculateCumulativeProgressUntil(year: number, month: number): number {
        let cumulativeProgress = 0;
        let currentYear = startDate.getFullYear();
        let currentMonth = startDate.getMonth();

        while (currentYear < year || (currentYear === year && currentMonth <= month)) {
            const daysInRange = getDaysInRangeOfMonth(currentYear, currentMonth);
            cumulativeProgress += (daysInRange / totalDays) * 100;

            // Stop if cumulative progress reaches 100%
            if (cumulativeProgress > 100) {
                cumulativeProgress = 100;
                break;
            }

            // Move to the next month
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
        return cumulativeProgress;
    }

    // Early return if the current date is after the end date
    if (currentDate > endDate) {
        return 100;
        
    }

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return  calculateCumulativeProgressUntil(currentYear, currentMonth);
  
}


// Function to recursively update all child tasks first
const updateChildTasks = (taskId: number) => {
  let task = taskMap.get(taskId);
  if (!task) return;

  // Find all child tasks
  const childTasks = this.ProjectPlanTaskList.filter(t => t.taskParentId === taskId);
  
  childTasks.forEach(child => {
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

    this.ProjectPlanTaskList.forEach(task => {
     task.completionProgress = calculateCumulativeProgress(task.taskAssignmentStartDate, task.taskAssignmentEndDate,new Date());
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


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
