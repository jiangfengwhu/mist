import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ScreenService } from 'src/app/screen.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { getMD5 } from 'src/app/utils/md5.function';
import { UserService } from '../user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'mist-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('croptpl') croptpl: TemplateRef<any>;
  infoForm: FormGroup;
  dialogRef: MatDialogRef<any>;
  isSubmit = false;
  type: string;
  imgSrc: string;
  cropHeight: number;
  cropWidth: number;
  ratio: number;
  hasPreview: boolean;
  style = {
    height: this.screen.isMobile ? '90vw' : '400px',
    width: this.screen.isMobile ? '90vw' : '400px',
    margin: this.screen.isMobile ? '10px auto' : 'auto'
  };
  constructor(
    public auth: AuthService,
    public screen: ScreenService,
    private dialog: MatDialog,
    private user: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.infoForm = this.fb.group({
      nickName: [this.auth.user.nickName, [Validators.required]],
      sign: [this.auth.user.sign]
    });
  }
  updateInfo() {
    this.user.updateInfo(this.infoForm.value).subscribe(re => {
      if (re['status']) {
        this.auth.user.nickName = this.infoForm.get('nickName').value;
        this.auth.user.sign = this.infoForm.get('sign').value;
        this.infoForm.markAsPristine();
      }
    });
  }
  changeAvatar() {
    this.type = '1';
    this.cropWidth = 150;
    this.cropHeight = 150;
    this.hasPreview = true;
    this.ratio = 1;
    this.imgSrc = this.auth.user.avatar || 'assets/da.jpg';
    this.openDialog();
  }
  changeBkg() {
    this.type = '2';
    this.cropWidth = 1200;
    this.cropHeight = 300;
    this.hasPreview = false;
    this.ratio = 4;
    this.imgSrc = this.auth.user.profilePic || '';
    this.openDialog();
  }
  changeGolden() {
    this.type = '3';
    this.cropWidth = 600;
    this.cropHeight = 600;
    this.hasPreview = false;
    this.ratio = 1;
    this.imgSrc = this.auth.user.golden || '';
    this.openDialog();
  }
  changeSrc(file: File) {
    this.imgSrc = URL.createObjectURL(file);
  }
  openDialog() {
    this.dialogRef = this.dialog.open(this.croptpl, {
      disableClose: true,
      panelClass: this.screen.isMobile ? 'fullscreen' : ''
    });
  }
  save(cav: HTMLCanvasElement) {
    this.isSubmit = true;
    cav.toBlob(
      blob => {
        getMD5(blob).then((re: string) => {
          const form = new FormData();
          form.append('type', this.type);
          form.append('pic', blob, re + '.jpeg');
          this.user.changePic(form).subscribe(se => {
            this.isSubmit = false;
            if (se['status']) {
              switch (this.type) {
                case '1':
                this.auth.user.avatar = se['path'];
                break;
                case '2':
                this.auth.user.profilePic = se['path'];
                break;
                case '3':
                this.auth.user.golden = se['path'];
                break;
              }
              this.dialogRef.close();
            }
          });
        });
      },
      'image/jpeg',
      0.85
    );
  }
}
