import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OT_outageTracker, APISaveData, OT_APiData, OTApiData, OTData, PreInsurenceFilterDto } from './Excute-insurence.model';


@Injectable({
  providedIn: 'root'
})
export class ExcuteInsurenceService {

  private readonly getInsuranceRecommendationActionURL = `${environment.apiUrl}/PreInsuranceRecommendationExcution/getInsuranceRecommendationAction`
  private readonly getInsuranceRecommendationActionStatusURL = `${environment.apiUrl}/PreInsuranceRecommendationExcution/getInsuranceRecommendationActionStatus`
  private readonly saveActionctmURL = `${environment.apiUrl}/PreInsuranceRecommendationExcution/saveInsuranceRecommendationActionctm`
 private readonly getActionDocTypeURL = `${environment.apiUrl}/PreInsuranceRecommendationExcution/getActionDocType`
  
  constructor(private http: HttpClient) { }
  getActions(userId: number, filter: PreInsurenceFilterDto): Observable<any[]> {
    filter.userId=userId
    return this.http.post<any[]>(this.getInsuranceRecommendationActionURL, filter)
  }
  saveAction(userId: number, action: any): Observable<any> {
    action.formValues.userId=userId
    const data ={
      ...action,
      DocTypeList: action.DocTypeList
    }
   
    return this.http.post<OT_outageTracker>(this.saveActionctmURL, data)
  }



  getActionStatus(): Observable<any[]> {
   
    return this.http.get<any[]>(this.getInsuranceRecommendationActionStatusURL)
  }

  getActionDocType(data:any): Observable<any[]> {

    return this.http.get<any[]>(`${this.getActionDocTypeURL}?ActionId=${data.preInsuranceActionId}`);

  }
  

 

}
