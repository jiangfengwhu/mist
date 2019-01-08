import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from '../auth.guard';
import { VideosResolverService } from './videos-resolver.service';
import { AntiqueComponent } from './antique/antique.component';
import { CommunityComponent } from './community/community.component';
import { ProfileComponent } from './profile/profile.component';
import { CommResolverService } from './comm-resolver.service';

const routes: Routes = [
  {
    path: '', component: UserComponent, canActivate: [AuthGuard], children: [
      { path: 'videos', component: AntiqueComponent, resolve: { videos: VideosResolverService } },
      { path: 'community', component: CommunityComponent, resolve: {comms: CommResolverService} },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: '/user/community', pathMatch: 'full'}
    ]
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
