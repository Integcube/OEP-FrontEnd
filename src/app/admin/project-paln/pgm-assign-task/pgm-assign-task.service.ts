import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PgmAssignTaskService {
  private readonly getprojectplan = `${environment.apiUrl}/ProjectPlanAssignTask/getAssignTaskList`;
  private readonly getplansURL = `${environment.apiUrl}/ProjectPlan/getplans`;
  private readonly getsitesURL = `${environment.apiUrl}/ProjectPlan/getsites`;
  private readonly gettaskurl = `${environment.apiUrl}/ProjectPlanAssignTask/getAssignTasks`;
  private readonly saveAssignTaskUrl = `${environment.apiUrl}/ProjectPlanAssignTask/saveAssignTask`;
  
  constructor(
    private http: HttpClient

  ) { }

  getProjectPlans(UserId): Observable<any[]> {
    return this.http.get<any[]>(`${this.getprojectplan}?UserId=${UserId}`);
  } 
  getplans(): Observable<any[]> {
    return this.http.get<any[]>(this.getplansURL);
  } 
  getsites(userId): Observable<any[]> {
    return this.http.get<any[]>(`${this.getsitesURL}?UserId=${userId}`);
  } 
  getPlanTask(startPlanId:number): Observable<any> {
    return this.http.get<any[]>(`${this.gettaskurl}?startPlanId=${startPlanId}`);
  } 

  saveAssignTaks(obj,List,userId): Observable<any> {
    obj.createdBy=userId;
    let data={
      Project:obj,
      Tasks:List,
      createdBy:userId
    }
    return this.http.post<any>(this.saveAssignTaskUrl, data) 
  }


}
