import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecaptchaDirective } from './recaptcha.directive';
import { UpButtonDirective } from './up-button.directive';
import { MasonryComponent } from './masonry/masonry.component';
import { MomentPipe } from './moment.pipe';
import { QuantityPipe } from './quantity.pipe';
import { DurationPipe } from './duration.pipe';
import { P2pvideoDirective } from './p2pvideo.directive';
import { NumericPipe } from './numeric.pipe';
import { CropperDirective } from './cropper.directive';
import { SanitizePipe } from './sanitize.pipe';
import { LoaderDirective } from './loader.directive';
import { P2PHlsDirective } from './p2phls.directive';
import { CommentComponent } from './comment/comment.component';
import { MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { AutolinkPipe } from './autolink.pipe';
import { HlsDirective } from './hls.directive';

@NgModule({
  declarations: [
    RecaptchaDirective,
    UpButtonDirective,
    MasonryComponent,
    MomentPipe,
    QuantityPipe,
    DurationPipe,
    P2pvideoDirective,
    NumericPipe,
    CropperDirective,
    SanitizePipe,
    LoaderDirective,
    P2PHlsDirective,
    CommentComponent,
    AutolinkPipe,
    HlsDirective
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  exports: [
    RecaptchaDirective,
    UpButtonDirective,
    MasonryComponent,
    MomentPipe,
    QuantityPipe,
    DurationPipe,
    P2pvideoDirective,
    NumericPipe,
    CropperDirective,
    SanitizePipe,
    LoaderDirective,
    P2PHlsDirective,
    CommentComponent,
    AutolinkPipe,
    HlsDirective
  ]
})
export class SharedModule {}
