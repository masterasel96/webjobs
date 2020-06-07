import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Title } from '@angular/platform-browser';
import { IResponse } from 'src/app/interfaces/core.interface';
import { ToastrService } from 'ngx-toastr';
import { LoadScreemComponent } from '../load-screem/load-screem.component';
import { SexType } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['../login-form/login-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  @ViewChild(LoadScreemComponent, { static: true }) loadScreem: LoadScreemComponent;
  private userName: string;
  private lastName: string;
  private email: string;
  private dni: string;
  private telf: number;
  private age: number;
  private sex: SexType;
  private password: string;
  private password2: string;
  private postalCode: number;
  private city: string;
  private region: string;
  private address: string;
  private offer: string;
  private privacity: boolean;
  constructor(
    private userService: UserService,
    private titleService: Title,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('WebJobs | Register');
  }

  public register(): void {
    if (this.password !== this.password2) {
      this.toastr.error('Las contraseñas no coinciden...');
      return;
    }
    if (this.privacity === undefined) {
      this.toastr.error('Debe aceptar las condiciones de privacidad...');
      return;
    }
    this.loadScreem.load(true);
    this.userService.register({
      userName: this.userName,
      lastName: this.lastName,
      email: this.email,
      dni: this.dni,
      telf: this.telf,
      age: this.age,
      sex: this.sex,
      password: this.password,
      postalCode: this.postalCode,
      city: this.city,
      region: this.region,
      address: this.address,
      offer: this.offer === 'true' ? true : false
    }).subscribe(
      (res) => {
        const returnData = res as IResponse;
        if (returnData.data.newUser) {
          this.toastr.success('Registro correcto...');
        }
        this.loadScreem.load(false);
        this.resetForm();
      },
      (err) => {
        const errorData = err.error as IResponse;
        this.toastr.error(errorData.data.error);
        this.loadScreem.load(false);
      }
    );
  }

  private resetForm(): void {
    this.userName = null;
    this.lastName = null;
    this.email = null;
    this.dni = null;
    this.telf = null;
    this.age = null;
    this.sex = null;
    this.password = null;
    this.password2 = null;
    this.postalCode = null;
    this.city = null;
    this.region = null;
    this.address = null;
    this.offer = null;
    this.privacity = false;
  }
}
