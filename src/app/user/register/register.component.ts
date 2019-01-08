import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors, FormControl, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { RecaptchaDirective } from 'src/app/shared/recaptcha.directive';
@Component({
  selector: 'mist-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild (RecaptchaDirective) recap: RecaptchaDirective;
  hide = true;
  registForm: FormGroup;
  isProcessing = false;
  stateMatcher = new CusStateMatcher();
  constructor(private _fb: FormBuilder, private _user: UserService, private route: Router) { }

  createForm() {
    this.registForm = this._fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'passwd': ['', [Validators.required, Validators.minLength(6)]],
      'repasswd': ['', [Validators.required]],
      'nickName': ['', [Validators.required]],
      'token': ['', [Validators.required]]
    }, {validators: repasswdValidator});
  }
  ngOnInit() {
    this.createForm();
  }
  submit() {
    this.isProcessing = true;
    this._user.regist(this.registForm.value).subscribe(tmp => {
      if (!tmp['status']) {
        this.recap.getCap();
      } else {
        this.route.navigate(['/user/login']);
      }
      this.isProcessing = false;
    });
  }
}


export const repasswdValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const passwd = control.get('passwd');
  const repasswd = control.get('repasswd');
  return passwd.value === repasswd.value ? null : { 'samepasswd': true };
};
export class CusStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | null): boolean {
    return (control.dirty || control.touched) && (control.invalid || form.hasError('samepasswd'));
  }
}
