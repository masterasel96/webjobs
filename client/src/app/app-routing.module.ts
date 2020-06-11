import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { IndexComponent } from './components/index/index.component';
import { WorkerComponent } from './components/worker/worker.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { NotifysComponent } from './components/notifys/notifys.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'index', component: IndexComponent },
  { path: 'worker', component: WorkerComponent },
  { path: 'control_panel', component: ControlPanelComponent},
  { path: 'notifys', component: NotifysComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
