import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { DataService } from './services/data.service';
import { EntriesComponent } from './components/entries/entries.component';
import { FormComponent } from './components/form/form.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { QualityNamePipe } from './pipes/quality-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WarehouseComponent,
    EntriesComponent,
    FormComponent,
    CreateUserComponent,
    NavbarComponent,
    QualityNamePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    FormsModule,
    MatSidenavModule,
    MatCardModule,
    MatRadioModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
