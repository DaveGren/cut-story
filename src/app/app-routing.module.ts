import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EntriesComponent } from './components/entries/entries.component';
import { FormComponent } from './components/form/form.component';
import { LoginComponent } from './components/login/login.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'create-user', 
    component: CreateUserComponent 
  },
  { 
    path: 'entries', 
    component: EntriesComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'form', 
    component: FormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'warehouse',
    component: WarehouseComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: '**',
    redirectTo: 'login'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
