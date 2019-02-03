import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatroomRoutingModule } from './chatroom-routing.module';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTabsModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CatalogComponent } from './catalog/catalog.component';
import { LiveroomComponent } from './liveroom/liveroom.component';

@NgModule({
  declarations: [ChatroomComponent, CatalogComponent, LiveroomComponent],
  imports: [
    CommonModule,
    ChatroomRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTabsModule
  ]
})
export class ChatroomModule { }
