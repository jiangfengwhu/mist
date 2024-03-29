import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { VideoComponent } from './video/video.component';
import { CreateComponent } from './create/create.component';
import {
  MatIconModule,
  MatButtonModule,
  MatStepperModule,
  MatChipsModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatProgressBarModule,
  MatTooltipModule,
  MatSidenavModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatSelectModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UploadComponent } from './upload/upload.component';
import { DetailComponent } from './detail/detail.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { UpdateComponent } from './update/update.component';
import { CategoryComponent } from './category/category.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [VideoComponent, CreateComponent, UploadComponent, DetailComponent, UpdateComponent, CategoryComponent, SearchComponent],
  imports: [
    CommonModule,
    VideoRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSidenavModule,
    ScrollDispatchModule,
    MatTabsModule,
    MatDividerModule,
    MatSelectModule,
    MatTooltipModule
  ]
})
export class VideoModule { }
