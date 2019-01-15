import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import {
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatButtonModule,
  MatTabsModule,
  MatTableModule,
  MatSortModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user/user.component';
import { ProfileComponent } from './profile/profile.component';
import { AntiqueComponent } from './antique/antique.component';
import { CommunityComponent } from './community/community.component';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    UserComponent,
    ProfileComponent,
    AntiqueComponent,
    CommunityComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    UserRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    SharedModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class UserModule {}
