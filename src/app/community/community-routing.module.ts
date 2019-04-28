import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityComponent } from './community/community.component';
import { PostComponent } from './post/post.component';
import { AuthGuard } from '../auth.guard';
import { HomeResolverService } from './home-resolver.service';

const routes: Routes = [
  { path: 'post', component: PostComponent, canActivate: [AuthGuard] },
  { path: '', component: CommunityComponent, resolve: { comms: HomeResolverService } },
  { path: ':id', component: CommunityComponent, resolve: { comms: HomeResolverService } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
