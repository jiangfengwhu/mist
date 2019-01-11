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
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [ScaffoldComponent, HomeComponent, ConfirmDialogComponent],
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
    SharedModule
  ],
  entryComponents: [
    MatProgressSpinner,
    ConfirmDialogComponent
  ],
  providers: [httpInterceptorProviders]
})
export class ScaffoldModule {}
