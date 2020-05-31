import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import { IResponse } from 'src/app/interfaces/core.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private userService: UserService,
    private titleService: Title,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('WebJobs | Login');
    this.toastr.success('asdasdasd', 'asdasd');
  }

  public checkLogin(): void {
    this.userService.checkLogin({
      email: $('#usuario').val(),
      password: $('#password').val()
    }).subscribe(
      (res) => {
        const returnData = res as IResponse;
        if (returnData.data.login) {
          console.log('Login correcto...');
        }
      },
      (err) => {
        const errorData = err.error as IResponse;
        console.log(errorData.data.error);
      }
    );
  }

}
