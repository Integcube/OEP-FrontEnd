import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumnetUpload, ReturnedDocumnet, ReturnedDocumnetTil } from './file-upload.model';


@Injectable({
  providedIn: 'root'
})
export class FileUploadDialogService {

  private readonly saveFile = `${environment.apiUrl}/ProjectReadinessChecklist/uploadFile`

  private readonly deleteFileTil = `${environment.apiUrl}/ProjectReadinessChecklist/deleteDocument`
  private readonly downloadFileUrl= `${environment.apiUrl}/ProjectReadinessChecklist/downloadFile`
  private readonly getFileList = `${environment.apiUrl}/ProjectReadinessChecklist/getFiles`

  constructor(private http: HttpClient) { }
  
  saveDocument(userId:number,  uploadDoc:DocumnetUpload,action:any): Observable<ReturnedDocumnet> {
    const formData = new FormData();
    formData.append('report',uploadDoc.file);
    formData.append('fileName', uploadDoc.name);
    formData.append('remarks', uploadDoc.remarks);
    formData.append('siteId', action.siteId.toString());
    formData.append('date', action.Date);
    formData.append('userId', userId.toString());
    formData.append('type', action.type.toString());
    formData.append('taskId', action.taskId.toString());
    return this.http.post<ReturnedDocumnet>(this.saveFile, formData)
  }
  getFileInfo(userId: number, action:any): Observable<any[]> {
    debugger
    let data = {
       userId,
       Date:action.Date,
       siteId:action.siteId,
       type:action.type,
       taskId:action.taskId,
      }
    return this.http.post<any[]>(this.getFileList, data)
  }
  deleteDocumentTil(DocId:number): Observable<any> {

    return this.http.get<any[]>(`${this.deleteFileTil}?DocId=${DocId}`);
   
  }
  downloadReport(DocId:number): Observable<any> {

    return this.http.post(`${this.downloadFileUrl}/${DocId}`, null, {
      responseType: 'blob',
      observe: 'response'
    });
  }



}
