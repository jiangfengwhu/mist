import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community/community.component';
import { SharedModule } from '../shared/shared.module';
import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatDividerModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { PostComponent } from './post/post.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CommunityComponent, PostComponent],
  imports: [
    CommonModule,
    CommunityRoutingModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ]
})
export class CommunityModule {}
