import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { PostComponent } from './post/post.component';
import { AuthGuard } from '../auth.guard';
import { HomeResolverService } from './home-resolver.service';

const routes: Routes = [
  {path: 'post', component: PostComponent, canActivate: [AuthGuard]},
  {path: '', component: GalleryComponent, resolve: {gas: HomeResolverService}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryRoutingModule { }
