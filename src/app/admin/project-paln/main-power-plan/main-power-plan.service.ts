import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { KeyIssueFilters } from '../project-plan.model';

@Injectable({
  providedIn: 'root'
})
export class MainPowerPlanService {
  private readonly getsitesURL = `${environment.apiUrl}/ProjectKeyIssues/getsites`;
  private readonly saveManpowerPlanURL = `${environment.apiUrl}/ProjectManpowerPlan/saveManpowerPlan`;
  private readonly getManpowerPlanURL = `${environment.apiUrl}/ProjectManpowerPlan/getManpowerPlan`;
  
  constructor(
    private http: HttpClient

  ) { }

  getsites(userId): Observable<any[]> {
    return this.http.get<any[]>(`${this.getsitesURL}?UserId=${userId}`);
  } 

  getManpowerPlan(Date: Date,siteId:number,chnageType:number): Observable<any> {
    return this.http.get<any>(`${this.getManpowerPlanURL}?siteId=${siteId}&chnageType=${chnageType}`);
      }

 
  saveManpowerPlan(ManpowerPlans: any, userId: number): Observable<any> {
    const filteredList = ManpowerPlans.filter(item => item.positionId !== 999999999);
      let data={
        ManpowerPlans:filteredList,
        userId:userId
      }
      return this.http.post<any>(this.saveManpowerPlanURL, data);
   }


}

