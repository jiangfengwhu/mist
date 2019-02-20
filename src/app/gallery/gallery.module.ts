import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery/gallery.component';
import { PostComponent } from './post/post.component';
import {
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDividerModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ItemComponent } from './item/item.component';

@NgModule({
  declarations: [GalleryComponent, PostComponent, ItemComponent],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    FormsModule,
    MatProgressSpinnerModule
  ]
})
export class GalleryModule {}
