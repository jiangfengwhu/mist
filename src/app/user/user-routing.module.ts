import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { VideosResolverService } from './videos-resolver.service';
import { AntiqueComponent } from './antique/antique.component';
import { CommunityComponent } from './community/community.component';
import { ProfileComponent } from './profile/profile.component';
import { CommResolverService } from './comm-resolver.service';
import { UserResolverService } from './user-resolver.service';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryResolverService } from './gallery-resolver.service';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: ':id', component: UserComponent, resolve: {user: UserResolverService}, children: [
      { path: 'videos', component: AntiqueComponent, resolve: { videos: VideosResolverService } },
      { path: 'community', component: CommunityComponent, resolve: {comms: CommResolverService} },
      { path: 'profile', component: ProfileComponent },
      { path: 'gallery', component: GalleryComponent, resolve: {gas: GalleryResolverService}}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
