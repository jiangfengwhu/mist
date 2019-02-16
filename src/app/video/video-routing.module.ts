import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoComponent } from './video/video.component';
import { AuthGuard } from '../auth.guard';
import { HomeResolverService } from './home-resolver.service';
import { DetailComponent } from './detail/detail.component';
import { DetailResolverService } from './detail-resolver.service';
import { UpdateComponent } from './update/update.component';
import { EditGuard } from '../edit.guard';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {path: '', component: VideoComponent, resolve: {videos: HomeResolverService}},
  {path: 'upload', component: UploadComponent, canActivate: [AuthGuard]},
  {path: ':id', component: DetailComponent, resolve: {video: DetailResolverService}},
  {path: 'edit/:id', component: UpdateComponent, canActivate: [AuthGuard, EditGuard], resolve: {video: DetailResolverService}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
