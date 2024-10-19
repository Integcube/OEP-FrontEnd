import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumnetUpload, ReturnedDocumnet, ReturnedDocumnetTil } from './file-upload.model';


@Injectable({
  providedIn: 'root'
})
export class FileUploadDialogService {

  private readonly saveFile = `${environment.apiUrl}/PreInsuranceRecommendationExcution/uploadFile`

  private readonly deleteFileTil = `${environment.apiUrl}/PreInsuranceRecommendationExcution/deleteDocument?DocId=`
  private readonly downloadFileUrl= `${environment.apiUrl}/PreInsuranceRecommendationExcution/downloadFile`
  private readonly getFileList = `${environment.apiUrl}/PreInsuranceRecommendationExcution/getFiles`

  constructor(private http: HttpClient) { }
  
  saveDocument(userId:number, action:any,  uploadDoc:DocumnetUpload): Observable<ReturnedDocumnet> {
    debugger
    const formData = new FormData();
    formData.append('report',uploadDoc.file);
    formData.append('siteId', action.siteId.toString());
    formData.append('remarks', uploadDoc.remarks);
    formData.append('yearId', action.yearId.toString());
    formData.append('actionId', action.preInsuranceActionId.toString());
    formData.append('docTypeId', uploadDoc.docTypeId.toString());
    formData.append('name', uploadDoc.name.toString());
  
    return this.http.post<any>(this.saveFile, formData)
  }
  getFileInfo(data:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.getFileList}?ActionId=${data.preInsuranceActionId}&siteId=${data.siteId}&yearId=${data.yearId}`);
  }
  deleteDocumentTil(DocId:number): Observable<ReturnedDocumnet> {
   
    return this.http.delete<any>(this.deleteFileTil+DocId)
  }
  downloadReport(DocId:number): Observable<any> {
    return this.http.post(`${this.downloadFileUrl}?DocId=${DocId}`, null, {
      responseType: 'blob',
      observe: 'response'
    });
  }



}
