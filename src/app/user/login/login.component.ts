import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { RecaptchaDirective } from 'src/app/shared/recaptcha.directive';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'mist-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild (RecaptchaDirective) recap: RecaptchaDirective;
  loginForm: FormGroup;
  isProcessing = false;
  hide = true;
  constructor(private _fb: FormBuilder, private _user: UserService, private _route: Router, private _auth: AuthService) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.loginForm = this._fb.group({
      'email': ['', [Validators.required]],
      'passwd': ['', [Validators.required]],
      'token': ['', [Validators.required]]
    });
  }
  submit() {
    this.isProcessing = true;
    this._user.login(this.loginForm.value).subscribe(re => {
      if (re['status']) {
        this._auth.user = re['user'];
        console.log(re);
        this._auth.redirectUrl ? this._route.navigate([this._auth.redirectUrl]) : this._route.navigate(['/']);
      } else {
        this.isProcessing = false;
        this.recap.getCap();
      }
    });
  }
}
