import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PreInsurenceFilterDto } from './preview-insurence.model';



@Injectable({
  providedIn: 'root'
})
export class PreviewInsurenceService {

  private readonly getInsuranceRecommendationActionURL = `${environment.apiUrl}/PreInsuranceRecommendationReview/getInsuranceRecommendationActionReview`
  private readonly getInsuranceRecommendationActionStatusURL = `${environment.apiUrl}/PreInsuranceRecommendationExcution/getInsuranceRecommendationActionStatus`
  private readonly saveActionctmURL = `${environment.apiUrl}/PreInsuranceRecommendationReview/saveInsuranceRecommendationActionctm`

  constructor(private http: HttpClient) { }
  getActions(userId: number, filter: PreInsurenceFilterDto): Observable<any[]> {
    filter.userId=userId
    return this.http.post<any[]>(this.getInsuranceRecommendationActionURL, filter)
  }
  saveAction(userId: number, action: any): Observable<any> {
    debugger
   action.userId=userId
  
    return this.http.post<any>(this.saveActionctmURL, action)
  }


  getActionStatus(): Observable<any[]> {
   
    return this.http.get<any[]>(this.getInsuranceRecommendationActionStatusURL)
  }
 
}
