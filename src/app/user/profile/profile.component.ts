import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ScreenService } from 'src/app/screen.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { getMD5 } from 'src/app/utils/md5.function';
import { UserService } from '../user.service';

@Component({
  selector: 'mist-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('croptpl') croptpl: TemplateRef<any>;
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
  constructor(public auth: AuthService, public screen: ScreenService, private dialog: MatDialog, private user: UserService) { }

  ngOnInit() {
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
  changeSrc(file: File) {
    this.imgSrc = URL.createObjectURL(file);
  }
  openDialog() {
    this.dialogRef = this.dialog.open(this.croptpl, {
      disableClose: true,
      panelClass: this.screen.isMobile ? 'fullscreen' : '',
    });
  }
  save(cav: HTMLCanvasElement) {
    this.isSubmit = true;
    cav.toBlob((blob => {
      getMD5(blob).then((re: string) => {
        const form = new FormData();
        form.append('type', this.type);
        form.append('pic', blob, re + '.jpeg');
        this.user.changePic(form).subscribe(se => {
          this.isSubmit = false;
          if (se['status']) {
            this.type === '1' ? this.auth.user.avatar = se['path'] : this.auth.user.profilePic = se['path'];
            this.dialogRef.close();
          }
        });
      });
    }), 'image/jpeg', 0.85);
  }
}
