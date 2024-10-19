import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AssignInsurenceService {

  private readonly getSiteControlURL =  `${environment.apiUrl}/AssignPreInsuranceRecommendation/getRecommendationSiteControl`
  private readonly getSelectedSiteControlURL=`${environment.apiUrl}/AssignPreInsuranceRecommendation/getSelectedSites`
  private readonly saveSiteControlURL =  `${environment.apiUrl}/AssignPreInsuranceRecommendation/saveSiteControl`

  
  constructor(private http: HttpClient) { }


  getSiteControl(userId): Observable<any[]> {
    return this.http.get<any[]>(`${this.getSiteControlURL}?UserId=${userId}`);
  } 


  getSelectedSiteControl(siteId: number, yearId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.getSelectedSiteControlURL}?SiteId=${siteId}&YearId=${yearId}`);
  }
  saveSiteControl(userId:number,siteId:number,data :any):Observable<any[]>{
    debugger
    let date = {"userId":userId,"siteId":siteId, "siteControl":data.siteControl,"year":data.selectedYear,};
    return this.http.post<any[]>(this.saveSiteControlURL, date).pipe(
      tap(data => console.log(JSON.stringify(data))),
    )
  }
}
