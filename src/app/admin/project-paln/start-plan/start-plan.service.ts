import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';

// Function to format date before sending to backend
function formatDateForBackend(date: Date): string {
  return formatDate(date, 'yyyy-MM-dd', 'en-US');
}


function formatDatesInList(taskList: any[]): any[] {
  return taskList.map(task => {
    return {
      ...task,
       taskAssignmentStartDate: formatDateForBackend(new Date(task.taskAssignmentStartDate )),
       taskAssignmentEndDate: formatDateForBackend(new Date(task.taskAssignmentEndDate)) ,
       phaseStartDate: formatDateForBackend(new Date(task.phaseStartDate )),
       phaseEndDate: formatDateForBackend(new Date(task.phaseEndDate))
    };

  });
}
@Injectable({
  providedIn: 'root'
})
export class StartPlanService {
  private readonly getprojectplan = `${environment.apiUrl}/ProjectPlan/getstartplans`;
  private readonly getplansURL = `${environment.apiUrl}/ProjectPlan/getplans`;
  private readonly getsitesURL = `${environment.apiUrl}/ProjectPlan/getsites`;
  private readonly gettaskurl = `${environment.apiUrl}/ProjectPlan/getAssignTask`;
  private readonly saveAssignTaskUrl = `${environment.apiUrl}/ProjectPlan/saveAssignTask`;
  
  constructor(
    private http: HttpClient

  ) { }

  getProjectPlans(): Observable<any[]> {
    return this.http.get<any[]>(this.getprojectplan);
  } 
  getplans(): Observable<any[]> {
    return this.http.get<any[]>(this.getplansURL);
  } 
  getsites(userId): Observable<any[]> {
    return this.http.get<any[]>(`${this.getsitesURL}?UserId=${userId}`);
    
  } 
  getPlanTask(planId:number,startPlanId:number): Observable<any> {
    return this.http.get<any[]>(`${this.gettaskurl}?planId=${planId}&startPlanId=${startPlanId}`);
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
