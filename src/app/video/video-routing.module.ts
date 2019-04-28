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
import { CategoryComponent } from './category/category.component';
import { CateResolverService } from './cate-resolver.service';
import { SearchComponent } from './search/search.component';
import { SearchResolverService } from './search-resolver.service';

const routes: Routes = [
  { path: '', component: VideoComponent, resolve: { videos: HomeResolverService } },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: ':id', component: DetailComponent, resolve: { video: DetailResolverService } },
  { path: 'edit/:id', component: UpdateComponent, canActivate: [AuthGuard, EditGuard], resolve: { video: DetailResolverService } },
  { path: 'category/:id', component: CategoryComponent, resolve: { videos: CateResolverService } },
  { path: 'search/:id', component: SearchComponent, resolve: { videos: SearchResolverService } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
