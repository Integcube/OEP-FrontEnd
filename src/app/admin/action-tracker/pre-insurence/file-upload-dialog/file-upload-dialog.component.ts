import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DocumnetUpload, ReturnedDocumnet } from './file-upload.model';
import { User } from 'src/app/core/models/user';
import { FileUploadDialogService } from './file-upload-dialog.service';
import { ExcuteInsurenceService } from '../Excute-insurence/Excute-insurence.service';


@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.sass']
})
export class FileUploadComponent extends UnsubscribeOnDestroyAdapter implements OnInit{
 
  //Get data from browsers Local Storage
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  uploadDoc:DocumnetUpload={
    name: null,
    remarks: null,
    file: null,
    docTypeId:-1,
    siteId:-1,
    actionId:-1,
    yearId:-1
  }
  DocTypeList:any[]=[];
  fileList:any[] =[]
  constructor(
    private dataService: FileUploadDialogService,
    public dialogRef: MatDialogRef<FileUploadComponent>,
    private dataService2: ExcuteInsurenceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
  ) {
    super()

  }

  ngOnInit(): void {
    this.getActionDocType(this.data.data);
    this.subs.sink = this.dataService.getFileInfo(this.data.data).subscribe({
      next:data=>{
          this.fileList = [...data]
      },
      error:err=>{ this.showNotification('black', err, 'bottom', 'center') },
    })
  }
  onNoClick() {
    this.dialogRef.close(this.fileList)
  }
 

  onFileChange(event) {
    this.uploadDoc.file = event.target.files[0];
  }
  getActionDocType(data) {
    this.subs.sink = this.dataService2.getActionDocType(data).subscribe({
      next: data => {
        this.DocTypeList = [...data];
      },
    })
  }
  submit(){
    if(this.uploadDoc.name  == null || !(this.uploadDoc.file instanceof File) || this.uploadDoc.remarks == null){
       this.showNotification('snackbar-danger','Please fill in the above fields','bottom','center')
    }
      this.subs.sink = this.dataService.saveDocument(this.user.id, this.data.data, this.uploadDoc).subscribe({
        next:data=>{
          this.ngOnInit();
          this.uploadDoc = new DocumnetUpload({})
        },
        error:err=>{ this.showNotification('black', err, 'bottom', 'center') },
      })
  }
  downloadReport(uploadDoc:any){
   
    this.subs.sink = this.dataService.downloadReport(uploadDoc.id).subscribe({
      next: data => { 
        if(data.body.size < 100){
          this.showNotification('snackbar-info', "No file attached with the form", 'bottom', 'center');
        }
        else{
          const fileExtension = uploadDoc.path.split('.').pop();
          const url = window.URL.createObjectURL(data.body);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${uploadDoc.name}.${fileExtension}`;
          a.click();
          window.URL.revokeObjectURL(url);
          this.showNotification('snackbar-success', "File Downloaded Sucessfully", 'bottom', 'center');
        }
        
      },
      error: err => {

        this.showNotification('black', err, 'bottom', 'center');
      }
    })
  }
  deleteFile(Doc:any){
 
      this.subs.sink = this.dataService.deleteDocumentTil( Doc.id).subscribe({
        next:data=>{
          this.showNotification('snackbar-success', "File Deleted Sucessfully", 'bottom', 'center');
          this.ngOnInit();
        },
        error:err=>{ 
          this.showNotification('black', err, 'bottom', 'center') }
      })
   

  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

}
