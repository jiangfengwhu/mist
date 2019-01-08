import { Injectable, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  dialogRef: MatDialogRef<any>;
  user$ = this._http.get('/api/logstatus').pipe(
    shareReplay(1)
  );
  redirectUrl: string;
  constructor(private _http: HttpClient, private _msg: MessageService, private router: Router) {}
  logoutDialog(tpl: TemplateRef<any>) {
    this.dialogRef = this._msg.openDialog(tpl);
  }
  logout() {
    return this._http.get('/api/logout').pipe(
      tap(re => {
        this._msg.openBar(re['msg'], {
          duration: 2000
        });
        if (re['status']) {
          this.user = null;
          this.dialogRef.close();
          this.router.navigate(['/']);
        }
      })
    );
  }
}
