import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { IndexComponent } from './components/index/index.component';


const routes: Routes = [
  { path: '', redirectTo: '/login/', pathMatch: 'full' },
  { path: 'login', redirectTo: '/login/', pathMatch: 'full' },
  { path: 'login/:msg?', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'index', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
