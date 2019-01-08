import { Injectable, TemplateRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatDialog, MatDialogConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private _snackbar: MatSnackBar, private _dialog: MatDialog) { }
  openBar(cont: string, config?: MatSnackBarConfig) {
    this._snackbar.open(cont, '关闭', config);
  }
  openDialog(tpl: TemplateRef<any>, config?: MatDialogConfig) {
    return this._dialog.open(tpl, config);
  }
  notify(re: any) {
    if (re['status']) {
      if (re['msg']) {
        this.openBar(re['msg'], {
          duration: 2000
        });
      }
    } else {
      this.openBar(re['msg']);
    }
  }
}
