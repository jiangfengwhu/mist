import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScaffoldComponent } from './scaffold/scaffold.component';

const routes: Routes = [
  {path: '', component: ScaffoldComponent, children: [
    {path: 'user', loadChildren: '../user/user.module#UserModule'},
    {path: 'video', loadChildren: '../video/video.module#VideoModule'},
    {path: 'community', loadChildren: '../community/community.module#CommunityModule'}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScaffoldRoutingModule { }
