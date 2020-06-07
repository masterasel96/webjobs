import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import { IResponse } from 'src/app/interfaces/core.interface';
import { ToastrService } from 'ngx-toastr';
import { LoadScreemComponent } from '../load-screem/load-screem.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['../login-form/login-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  @ViewChild(LoadScreemComponent, { static: true }) loadScreem: LoadScreemComponent;
  constructor(
    private userService: UserService,
    private titleService: Title,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.titleService.setTitle('WebJobs | Register');
  }

  public register(): void {
    if ($('#password').val() !== $('#password2').val()) {
      this.toastr.error('Las contraseñas no coinciden...');
      return;
    }
    if (!$('#privacy').is(':checked')) {
      this.toastr.error('Debe aceptar las condiciones de privacidad...');
      return;
    }
    this.loadScreem.load(true);
    this.userService.register({
      userName: $('#name').val(),
      lastName: $('#last_name').val(),
      email: $('#email').val(),
      dni: $('#dni').val(),
      telf: $('#telf').val(),
      age: $('#age').val(),
      sex: $('#sex').val(),
      password: $('#password').val(),
      postalCode: $('#postal_code').val(),
      city: $('#city').val(),
      region: $('#region').val(),
      address: $('#address').val(),
      offer: $('#offer').val() === 'true' ? true : false
    }).subscribe(
      (res) => {
        const returnData = res as IResponse;
        if (returnData.data.newUser) {
          this.toastr.success('Registro correcto...');
        }
        this.loadScreem.load(false);
        this.router.navigate(['/login', 'Registro correcto...'], { skipLocationChange: true });
      },
      (err) => {
        const errorData = err.error as IResponse;
        this.toastr.error(errorData.data.error);
        this.loadScreem.load(false);
      }
    );
  }
}
