import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectPhase, ProjectPlan, ProjectPlanMainTask, ProjectPlanPhase, ProjectPlanSubTask, ProjectPlanTaskVm } from '../project-plan.model';
import { User } from 'src/app/core/models/user';
import { formatDate } from '@angular/common';

// Function to format date before sending to backend
function formatDateForBackend(date: Date): string {
  return formatDate(date, 'yyyy-MM-dd', 'en-US');
}


function formatDatesInList(taskList: any[]): any[] {
  return taskList.map(task => {
    return {
      ...task,
       taskAssignmentStartDate:task.taskAssignmentStartDate?formatDateForBackend(new Date(task.taskAssignmentStartDate )):null,
       taskAssignmentEndDate: task.taskAssignmentEndDate?formatDateForBackend(new Date(task.taskAssignmentEndDate)):null ,
       phaseStartDate:task.phaseStartDate? formatDateForBackend(new Date(task.phaseStartDate )):null,
       phaseEndDate:task.phaseEndDate? formatDateForBackend(new Date(task.phaseEndDate)):null
    };

  });
}
@Injectable({
  providedIn: 'root'
})
export class ProjectPlanService {
  private readonly getprojectplan = `${environment.apiUrl}/ProjectPlan/getPlans`;
  private readonly saveplanURL = `${environment.apiUrl}/ProjectPlan/savePlan`;
  private readonly deletePlanURL = `${environment.apiUrl}/ProjectPlan/deletePlan?planId`;
  private readonly getPhaseListURL = `${environment.apiUrl}/ProjectPlan/getPhaseList?planId`;
  private readonly getPhaseProjecUrl = `${environment.apiUrl}/ProjectPlan/getById?planId`;
  private readonly saveAssignTaskUrl = `${environment.apiUrl}/ProjectPlan/saveAssignTask`;
  private readonly CopyPlanURL = `${environment.apiUrl}/ProjectPlan/makecopyplan?planId`;
  //Task URLS
  private readonly savephaseUrl = `${environment.apiUrl}/ProjectPlan/savePhaseTask`;
  private readonly gettaskurl = `${environment.apiUrl}/ProjectPlan/getPlanTaskBy?planId`;
  private readonly saveMainTaskUrl = `${environment.apiUrl}/ProjectPlan/savemaintask`;
  private readonly savesubtaskUrl = `${environment.apiUrl}/ProjectPlan/savesubtask`;
  private readonly deletetaskURL = `${environment.apiUrl}/ProjectPlan/deletetask`;
  private readonly deletephaseURL = `${environment.apiUrl}/ProjectPlan/deletephase`;
  private readonly getpredecessorTaskUrl = `${environment.apiUrl}/ProjectPlan/getpredecessorTask`;
  private readonly getpredecessorTypeUrl = `${environment.apiUrl}/ProjectPlan/getpredecessor`;
  private readonly getsitesURL = `${environment.apiUrl}/ProjectPlan/getsites`;
  constructor(private http: HttpClient) { }
  //Get data from browsers Local Storage
  // Function to format date before sending to backend
  private readonly ManualURL = `${environment.apiUrl}/Account/downloadUserManual`;
  downloadUserManual(): Observable<Blob> {
    return this.http.get(`${this.ManualURL}`, { responseType: 'blob' });
  }
  getProjectPlans(userId): Observable<ProjectPlan[]> {
    return this.http.get<ProjectPlan[]>(`${this.getprojectplan}?UserId=${userId}`);
  } 

  getProjectPhase(): Observable<ProjectPhase[]> {
    return this.http.get<ProjectPhase[]>(this.getPhaseListURL);
  } 
  getplanphase(planId): Observable<ProjectPhase[]> {
    return this.http.get<ProjectPhase[]>(`${this.getPhaseProjecUrl}=${planId}`);
  } 
  

  saveplan(userId,data): Observable<ProjectPlan> {
    data.createdBy=userId;
    data.startDate = formatDateForBackend(data.startDate);
    return this.http.post<ProjectPlan>(this.saveplanURL, data) 
  }

  deletePlan(plan: ProjectPlan): Observable<number> {
    const planId = plan.planId;
    return this.http.delete<number>(`${this.deletePlanURL}=${planId}`);
  }

  makecopyOfPaln(plan: ProjectPlan): Observable<number> {
    const planId = plan.planId;
    return this.http.get<number>(`${this.CopyPlanURL}=${planId}`);
  }


 getPlanTask(planId:number): Observable<any> {
    return this.http.get<any>(`${this.gettaskurl}=${planId}`);
  } 

  savephase (userId,data): Observable<ProjectPlanPhase> {
    data.createdBy=userId;
    data.weightage=parseFloat(data.weightage);
    data.duration=parseFloat(data.duration);
    data.displayOrder=parseInt(data.displayOrder);
    
    return this.http.post<ProjectPlanPhase>(this.savephaseUrl, data) 
  }

  savemanintask(userId,data): Observable<ProjectPlanMainTask> {
    data.createdBy=userId;
    data.duration=parseFloat(data.duration);
    data.lagDays=parseFloat(data.lagDays);
    data.idealScore=0;
    debugger
    return this.http.post<ProjectPlanMainTask>(this.saveMainTaskUrl, data) 
  }

  savesubtask(userId,data): Observable<ProjectPlanSubTask> {
    data.createdBy=userId;
    data.duration= parseFloat(data.duration);
    data.lagDays=parseFloat(data.lagDays);
    data.idealScore=0;
    return this.http.post<ProjectPlanSubTask>(this.savesubtaskUrl, data) 
  }

  deletetask(taskId: number,userId:number): Observable<number> {
return this.http.delete<number>(`${this.deletetaskURL}?taskId=${taskId}&userId=${userId}`);
  }
  deletephase(phaseId: number,userId:number): Observable<number> {
    return this.http.delete<number>(`${this.deletephaseURL}?phaseId=${phaseId}&userId=${userId}`);
      }

   getpredecessorTask(planId): Observable<any[]> {
        return this.http.get<any[]>(`${this.getpredecessorTaskUrl}?planId=${planId}`);
      } 

      getpredecessorType(): Observable<any[]> {
        return this.http.get<any[]>(this. getpredecessorTypeUrl);
      } 
      getsites(userId): Observable<any[]> {
        return this.http.get<any[]>(`${this.getsitesURL}?UserId=${userId}`);
        
      } 

      saveAssignTaks(obj,List,userId): Observable<any> {
        obj.startDate = formatDateForBackend(obj.startDate);
        const formattedTaskList = formatDatesInList(List);
        obj.createdBy=userId;
        let data={
          Project:obj,
          Tasks:formattedTaskList,
          createdBy:userId,
          
        }
        return this.http.post<any>(this.saveAssignTaskUrl, data) 
      }

      
}



