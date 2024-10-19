import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { KeyIssueFilters } from '../project-plan.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectKeyIssuesService {
  private readonly getsitesURL = `${environment.apiUrl}/ProjectKeyIssues/getsites`;
  private readonly getKeyIssuesURL = `${environment.apiUrl}/ProjectKeyIssues/getKeyIssues`;
  private readonly saveKeyIssuesURL = `${environment.apiUrl}/ProjectKeyIssues/saveKeyIssues`;
  
  constructor(
    private http: HttpClient

  ) { }
  
  getsites(userId): Observable<any[]> {
    return this.http.get<any[]>(`${this.getsitesURL}?UserId=${userId}`);
  } 

  getKeyIssues(Date: Date,siteId:number): Observable<any> {
    return this.http.get<any>(`${this.getKeyIssuesURL}?date=${Date.toISOString()}&siteId=${siteId}`);
      }


      saveKeyIssues(data: KeyIssueFilters, userId: number): Observable<KeyIssueFilters> {

        data.userId = userId;

    
        return this.http.post<KeyIssueFilters>(this.saveKeyIssuesURL, data);
      }


}

