import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/core/models/user';
import { formatDate } from '@angular/common';
import { Preinsurence } from './pre-insurenc.model';

// Function to format date before sending to backend
function formatDateForBackend(date: Date): string {
  return formatDate(date, 'yyyy-MM-dd', 'en-US');
}



@Injectable({
  providedIn: 'root'
})
export class PreInsurenceService {
  private readonly getprojectplan = `${environment.apiUrl}/PreInsuranceRecommendation/getPreInsuranceRecommendation`;
  private readonly saveplanURL = `${environment.apiUrl}/PreInsuranceRecommendation/savePreInsuranceRecommendation`;
  private readonly deleteURL = `${environment.apiUrl}/PreInsuranceRecommendation/deletePreInsuranceRecommendation`;
  private readonly gettaskurl = `${environment.apiUrl}/PreInsuranceRecommendation/getPreInsuranceRecommendationAction`;
  private readonly saveActionUrl = `${environment.apiUrl}/PreInsuranceRecommendation/savePreInsuranceRecommendationAction`;
  private readonly deletephaseURL = `${environment.apiUrl}/PreInsuranceRecommendation/deletePreInsuranceRecommendationAction`;
  private readonly getDoctypeURL = `${environment.apiUrl}/PreInsuranceRecommendation/getDoctypeURL`;

  
  constructor(private http: HttpClient) { }

  getData(userId): Observable<any[]> {
    return this.http.get<any[]>(`${this.getprojectplan}?UserId=${userId}`);
  } 

  saveplan(userId,data): Observable<Preinsurence> {
    data.createdBy=userId;
    return this.http.post<Preinsurence>(this.saveplanURL, data) 
  }

  delete(plan: any): Observable<number> {
    const preInsuranceId = plan.preInsuranceId;
    return this.http.delete<number>(`${this.deleteURL}?preInsuranceId=${preInsuranceId}`);
  }

  getActionData(preInsuranceId:number): Observable<any> {
     return this.http.get<any>(`${this.gettaskurl}?preInsuranceId=${preInsuranceId}`);
  } 

  saveAction (userId,data): Observable<any> {
    debugger
    data.model.createdBy=userId;
    const data2={
      Action:data.model,
      ActionDocType:data.roleList,
    }

    return this.http.post<any>(this.saveActionUrl, data2) 
  }

 deleteAction(PreInsuranceActionId: number): Observable<number> {
   return this.http.delete<number>(`${this.deletephaseURL}?preInsuranceActionId=${PreInsuranceActionId}`);
 }

 DocumentsType(PreInsuranceActionId:Number): Observable<any> {
  return this.http.get<any>(`${this.getDoctypeURL}?PreInsuranceActionId=${PreInsuranceActionId}`);
} 
 
}



