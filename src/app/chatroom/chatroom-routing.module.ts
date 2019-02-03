import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { LiveroomComponent } from './liveroom/liveroom.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {path: 'text', component: ChatroomComponent},
  {path: 'live', component: LiveroomComponent, canActivate: [AuthGuard]},
  {path: '', component: CatalogComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatroomRoutingModule { }
