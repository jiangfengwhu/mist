import { Injectable, TemplateRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from './scaffold/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  dialogRef: MatDialogRef<any>;

  constructor(private _snackbar: MatSnackBar, private _dialog: MatDialog) { }
  openBar(cont: string, config?: MatSnackBarConfig) {
    this._snackbar.open(cont, '关闭', config);
  }
  openDialog(tpl: TemplateRef<any>, config?: MatDialogConfig) {
    this.dialogRef = this._dialog.open(tpl, config);
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
  openConfirm(msg: string, ac: Observable<any>) {
    this._dialog.open(ConfirmDialogComponent, {
      data: {
        msg: msg,
        action: ac
      }
    });
  }
  closeAllDialog() {
    this._dialog.closeAll();
  }
}
