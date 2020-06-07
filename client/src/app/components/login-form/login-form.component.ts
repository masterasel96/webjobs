import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import { IResponse } from 'src/app/interfaces/core.interface';
import { ToastrService } from 'ngx-toastr';
import { LoadScreemComponent } from '../load-screem/load-screem.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  @ViewChild(LoadScreemComponent, { static: true }) loadScreem: LoadScreemComponent;
  private msg: string = null;
  constructor(
    private userService: UserService,
    private titleService: Title,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.msg = this.activatedRoute.snapshot.params.msg;
  }

  ngOnInit() {
    this.titleService.setTitle('WebJobs | Login');
    if (this.msg) {
      this.toastr.success(this.msg);
    }
  }

  public checkLogin(): void {
    this.loadScreem.load(true);
    this.userService.checkLogin({
      email: $('#usuario').val(),
      password: $('#password').val()
    }).subscribe(
      (res) => {
        const returnData = res as IResponse;
        if (returnData.data.login) {
          this.toastr.success('Login Correcto');
        }
        this.loadScreem.load(false);
      },
      (err) => {
        const errorData = err.error as IResponse;
        this.toastr.error(errorData.data.error);
        this.loadScreem.load(false);
      }
    );
  }

}
