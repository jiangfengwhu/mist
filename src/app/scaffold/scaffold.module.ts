import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScaffoldRoutingModule } from './scaffold-routing.module';
import { ScaffoldComponent } from './scaffold/scaffold.component';
import {
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatSnackBarModule,
  MatDialogModule,
  MatListModule,
  MatBottomSheetModule,
  MatProgressSpinner,
  MatProgressSpinnerModule,
  MatProgressBarModule,
} from '@angular/material';
import { httpInterceptorProviders } from '../http-interceptors';
import { HomeComponent } from './home/home.component';
@NgModule({
  declarations: [ScaffoldComponent, HomeComponent],
  imports: [
    CommonModule,
    ScaffoldRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatListModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  entryComponents: [
    MatProgressSpinner
  ],
  providers: [httpInterceptorProviders]
})
export class ScaffoldModule {}
