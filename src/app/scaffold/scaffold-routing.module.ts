import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScaffoldComponent } from './scaffold/scaffold.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '', component: ScaffoldComponent, children: [
      { path: 'user', loadChildren: '../user/user.module#UserModule' },
      { path: 'video', loadChildren: '../video/video.module#VideoModule' },
      { path: 'community', loadChildren: '../community/community.module#CommunityModule' },
      { path: 'chatroom', loadChildren: '../chatroom/chatroom.module#ChatroomModule' },
      { path: 'gallery', loadChildren: '../gallery/gallery.module#GalleryModule' },
      { path: '', redirectTo: '/video', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScaffoldRoutingModule { }
