import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

export interface DialogData {
  msg: string;
  action: Observable<any>;
}

@Component({
  selector: 'mist-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  isSubmitting: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  ngOnInit() {}
  action() {
    this.isSubmitting = true;
    this.data.action.subscribe(re => {
      this.isSubmitting = false;
      if (re['status']) {
        this.dialogRef.close();
      }
    });
  }
}
