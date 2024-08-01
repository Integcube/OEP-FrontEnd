import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectReadiness, ProjectReadinessPhase, ProjectReadinessTask } from './project-Readiness.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectReadinessService {
  private readonly getPhaseProjecUrl = `${environment.apiUrl}/ProjectReadinessChecklist/getReadnessChartList?userId`;
  private readonly saveplanURL = `${environment.apiUrl}/ProjectReadinessChecklist/saveReadiness`;
  private readonly deletePlanURL = `${environment.apiUrl}/ProjectReadinessChecklist/deletePlan?planId`;
  private readonly gettaskurl = `${environment.apiUrl}/ProjectReadinessChecklist/getPlanTaskBy?planId`;
  private readonly savephaseUrl = `${environment.apiUrl}/ProjectReadinessChecklist/savePhaseTask`;
  private readonly deletephaseURL = `${environment.apiUrl}/ProjectReadinessChecklist/deletephase`;
  private readonly saveMainTaskUrl = `${environment.apiUrl}/ProjectReadinessChecklist/savemaintask`;
  private readonly getsitesURL = `${environment.apiUrl}/ProjectKeyIssues/getsites`;
  private readonly CopyPlanURL = `${environment.apiUrl}/ProjectReadinessChecklist/makecopyplan?planId`;
  private readonly deletetaskURL = `${environment.apiUrl}/ProjectReadinessChecklist/deletetask`;
  
  constructor(private http: HttpClient) { }

  getProjectPlans(UserId): Observable<any[]> {
    return this.http.get<any[]>(`${this.getPhaseProjecUrl}=${UserId}`);
  } 

  saveplan(userId,data): Observable<ProjectReadiness> {
    debugger   
    data.createdBy=userId;
    return this.http.post<ProjectReadiness>(this.saveplanURL, data) 
  }

  deletePlan(plan: ProjectReadiness): Observable<number> {
    const planId = plan.planId;
    return this.http.delete<number>(`${this.deletePlanURL}=${planId}`);
  }

  getsites(userId): Observable<any[]> {
    return this.http.get<any[]>(`${this.getsitesURL}?UserId=${userId}`);
  } 

// task section 
getPlanTask(planId:number): Observable<any> {
  return this.http.get<any>(`${this.gettaskurl}=${planId}`);
} 


savephase (userId,data): Observable<ProjectReadinessPhase> {
  debugger
  data.createdBy=userId;
  data.weightage=parseFloat(data.weightage);
  data.displayOrder=parseInt(data.displayOrder);
  
  return this.http.post<ProjectReadinessPhase>(this.savephaseUrl, data) 
}

deletephase(phaseId: number,userId:number): Observable<number> {
  return this.http.delete<number>(`${this.deletephaseURL}?phaseId=${phaseId}&userId=${userId}`);
    }


    savemanintask(userId,data): Observable<ProjectReadinessTask> {
      data.createdBy=userId;
      data.duration=parseFloat(data.duration);
      data.idealScore=parseFloat(data.idealScore);
     
      return this.http.post<ProjectReadinessTask>(this.saveMainTaskUrl, data) 
    }

    makecopyOfPaln(plan: any): Observable<number> {
      const planId = plan.planId;
      return this.http.get<number>(`${this.CopyPlanURL}=${planId}`);
    }
    deletetask(taskId: number,userId:number): Observable<number> {
      return this.http.delete<number>(`${this.deletetaskURL}?taskId=${taskId}&userId=${userId}`);
        }

}


