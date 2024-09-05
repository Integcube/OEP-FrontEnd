import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/core/models/user';
import { formatDate } from '@angular/common';

// Function to format date before sending to backend
function formatDateForBackend(date: Date): string {
  return formatDate(date, 'yyyy-MM-dd', 'en-US');
}



@Injectable({
  providedIn: 'root'
})
export class PreInsurenceService {
  private readonly getprojectplan = `${environment.apiUrl}/ProjectPlan/getPlans`;
  private readonly saveplanURL = `${environment.apiUrl}/ProjectPlan/savePlan`;

  constructor(private http: HttpClient) { }
  //Get data from browsers Local Storage
  // Function to format date before sending to backend

//   getProjectPlans(userId): Observable<ProjectPlan[]> {
//     return this.http.get<ProjectPlan[]>(`${this.getprojectplan}?UserId=${userId}`);
//   } 

//   getProjectPhase(): Observable<ProjectPhase[]> {
//     return this.http.get<ProjectPhase[]>(this.getPhaseListURL);
//   } 
//   getplanphase(planId): Observable<ProjectPhase[]> {
//     return this.http.get<ProjectPhase[]>(`${this.getPhaseProjecUrl}=${planId}`);
//   } 
  

//   saveplan(userId,data): Observable<ProjectPlan> {
//     data.createdBy=userId;
//     data.startDate = formatDateForBackend(data.startDate);
//     return this.http.post<ProjectPlan>(this.saveplanURL, data) 
//   }

//   deletePlan(plan: ProjectPlan): Observable<number> {
//     const planId = plan.planId;
//     return this.http.delete<number>(`${this.deletePlanURL}=${planId}`);
//   }

//   makecopyOfPaln(plan: ProjectPlan): Observable<number> {
//     const planId = plan.planId;
//     return this.http.get<number>(`${this.CopyPlanURL}=${planId}`);
//   }


//  getPlanTask(planId:number): Observable<any> {
//     return this.http.get<any>(`${this.gettaskurl}=${planId}`);
//   } 

//   savephase (userId,data): Observable<ProjectPlanPhase> {
//     data.createdBy=userId;
//     data.weightage=parseFloat(data.weightage);
//     data.duration=parseFloat(data.duration);
//     data.displayOrder=parseInt(data.displayOrder);
    
//     return this.http.post<ProjectPlanPhase>(this.savephaseUrl, data) 
//   }

//   savemanintask(userId,data): Observable<ProjectPlanMainTask> {
//     data.createdBy=userId;
//     data.duration=parseFloat(data.duration);
//     data.lagDays=parseFloat(data.lagDays);
//     data.idealScore=0;
//     debugger
//     return this.http.post<ProjectPlanMainTask>(this.saveMainTaskUrl, data) 
//   }

//   savesubtask(userId,data): Observable<ProjectPlanSubTask> {
//     data.createdBy=userId;
//     data.duration= parseFloat(data.duration);
//     data.lagDays=parseFloat(data.lagDays);
//     data.idealScore=0;
//     return this.http.post<ProjectPlanSubTask>(this.savesubtaskUrl, data) 
//   }

//   deletetask(taskId: number,userId:number): Observable<number> {
// return this.http.delete<number>(`${this.deletetaskURL}?taskId=${taskId}&userId=${userId}`);
//   }
//   deletephase(phaseId: number,userId:number): Observable<number> {
//     return this.http.delete<number>(`${this.deletephaseURL}?phaseId=${phaseId}&userId=${userId}`);
//       }

//    getpredecessorTask(planId): Observable<any[]> {
//         return this.http.get<any[]>(`${this.getpredecessorTaskUrl}?planId=${planId}`);
//       } 

//       getpredecessorType(): Observable<any[]> {
//         return this.http.get<any[]>(this. getpredecessorTypeUrl);
//       } 
//       getsites(userId): Observable<any[]> {
//         return this.http.get<any[]>(`${this.getsitesURL}?UserId=${userId}`);
        
//       } 

//       saveAssignTaks(obj,List,userId): Observable<any> {
//         obj.startDate = formatDateForBackend(obj.startDate);
//         const formattedTaskList = formatDatesInList(List);
//         obj.createdBy=userId;
//         let data={
//           Project:obj,
//           Tasks:formattedTaskList,
//           createdBy:userId,
          
//         }
//         return this.http.post<any>(this.saveAssignTaskUrl, data) 
//       }

      
}



