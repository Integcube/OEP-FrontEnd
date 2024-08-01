import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DocumnetUpload, ReturnedDocumnet } from './file-upload.model';
import { User } from 'src/app/core/models/user';
import { FileUploadDialogService } from './file-upload-dialog.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-file-upload-dialoga',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.sass']
})
export class FileUploadDialogReadinessComponent extends UnsubscribeOnDestroyAdapter implements OnInit{
 
  //Get data from browsers Local Storage
  user: User = JSON.parse(localStorage.getItem('currentUser'));
  uploadDoc:DocumnetUpload={
    name: null,
    remarks: null,
    file: null,
  }
  fileList:any[] =[]
  constructor(
    private dataService: FileUploadDialogService,
    public dialogRef: MatDialogRef<FileUploadDialogReadinessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    super()

  }

  ngOnInit(): void {
    this.data.data.Date = this.datePipe.transform(this.data.data.Date, 'dd-MMM-yyyy');
    this.subs.sink = this.dataService.getFileInfo(this.user.id, this.data.data).subscribe({
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
  
  submit(){
    if(this.uploadDoc.name  == null || !(this.uploadDoc.file instanceof File) || this.uploadDoc.remarks == null){
       this.showNotification('snackbar-danger','Please fill in the above fields','bottom','center')
    }
    else if(this.data.action=='outageTracker'){
      this.data.data.Date = this.datePipe.transform(this.data.data.Date, 'dd-MMM-yyyy');
 
      this.subs.sink = this.dataService.saveDocument(this.user.id, this.uploadDoc,this.data.data).subscribe({
        next:data=>{
          this.ngOnInit();
          this.uploadDoc = new DocumnetUpload({})
        },
        error:err=>{ this.showNotification('black', err, 'bottom', 'center') },
      })
    }

    
  }
  downloadReport(uploadDoc:any){
    this.subs.sink = this.dataService.downloadReport(uploadDoc.docId).subscribe({
      next: data => { 
        if(data.body.size < 100){
          this.showNotification('snackbar-info', "No file attached with the form", 'bottom', 'center');
        }
        else{
          const fileExtension = uploadDoc.path.split('.').pop();
          const url = window.URL.createObjectURL(data.body);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${uploadDoc.fileName}.${fileExtension}`;
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
  deleteFile(obj:any){

      this.subs.sink = this.dataService.deleteDocumentTil(obj.docId ).subscribe({
        next:data=>{
          this.ngOnInit();
          this.showNotification('snackbar-success', "File Deleted Sucessfully", 'bottom', 'center');
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
