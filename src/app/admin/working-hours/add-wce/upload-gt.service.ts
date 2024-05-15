import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CUsers } from 'src/app/shared/common-interface/common-interface';
import { MonthlyHoursGt, UploadGt } from './upload-gt.model';

@Injectable({
  providedIn: 'root'
})
export class UploadGtService{
  private readonly getWokingHoursURL = `${environment.apiUrl}/WH_GTHours/getWorkingHours`;
  private readonly saveWorkingHoursURL = `${environment.apiUrl}/WH_GTHours/saveHours`;
  private readonly getInterfacesURL = `${environment.apiUrl}/WH_GTHours/getIntefaces`
  private readonly getMonthlyHoursURL = `${environment.apiUrl}/WH_GTHours/getMonthlyHours`

  

  constructor(private http: HttpClient,) { }
  getWorkingHours(userId): Observable<UploadGt[]> {
    let data = { userId };
    return this.http.post<UploadGt[]>(this.getWokingHoursURL, data)
  }
  saveWorkingHours(userId:number, data:MonthlyHoursGt[]): Observable<UploadGt> {
    let datas = {userId, data};
    debugger;
    return this.http.post<UploadGt>(this.saveWorkingHoursURL, datas) 
  }
  getInterface(userId): Observable<CUsers[]> {
    let date = {"userId":userId};
    return this.http.post<CUsers[]>(this.getInterfacesURL, date)
  }
  getMonthlyHours(yearId:number, unitId:number): Observable<MonthlyHoursGt[]> {
    const data = {
      yearId,
      unitId
    }
    return this.http.post<MonthlyHoursGt[]>(this.getMonthlyHoursURL, data)
  }
}
