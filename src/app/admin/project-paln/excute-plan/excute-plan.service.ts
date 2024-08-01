import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcuteplanService {
  private readonly getExcutedPlanUrl = `${environment.apiUrl}/ProjectPlan/getExecutedPlan?userId=`;
  private readonly getplansURL = `${environment.apiUrl}/ProjectPlan/getplans`;
  private readonly getsitesURL = `${environment.apiUrl}/ProjectPlan/getsites`;
  private readonly gettaskurl = `${environment.apiUrl}/ProjectPlanAssignTask/getExceTasks`;
  private readonly saveAssignTaskUrl = `${environment.apiUrl}/ProjectPlanAssignTask/saveProgress`;
  
  constructor(
    private http: HttpClient

  ) { }

  getProjectPlans(userId:number): Observable<any[]> {

    return this.http.get<any[]>(`${this.getExcutedPlanUrl}${userId}`);
  } 
  getplans(): Observable<any[]> {
    return this.http.get<any[]>(this.getplansURL );
  } 
  getsites(): Observable<any[]> {
    return this.http.get<any[]>(this.getsitesURL);
  } 

  getPlanTask(UserId:number,startPlanId:number,yearList:any): Observable<any> {
    let data={
      UserId:UserId,
      startPlanId:startPlanId,
      Months:yearList
    }
    return this.http.post<any[]>(this.gettaskurl,data);
  } 

  saveProgress(List,userId): Observable<any> {
    let data={
      Tasks:List,
      createdBy:userId
    }
    return this.http.post<any>(this.saveAssignTaskUrl, data) 
  }

}
