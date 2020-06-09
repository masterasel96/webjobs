import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { UserService } from './services/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoadScreemComponent } from './components/load-screem/load-screem.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { IndexComponent } from './components/index/index.component';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from 'time-ago-pipe';
import { WorkerComponent } from './components/worker/worker.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    RegisterFormComponent,
    LoadScreemComponent,
    NavbarComponent,
    IndexComponent,
    TimeAgoPipe,
    WorkerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3500,
      positionClass: 'toast-top-right',
      preventDuplicates: false
    })
  ],
  providers: [UserService],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule { }
