import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatroomRoutingModule } from './chatroom-routing.module';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTabsModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChatroomComponent],
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
