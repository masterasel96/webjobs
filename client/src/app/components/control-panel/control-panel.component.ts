import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadScreemComponent } from '../load-screem/load-screem.component';
import { UserService } from 'src/app/services/user.service';
import { ContractService } from 'src/app/services/contract.service';
import { ExperienceService } from 'src/app/services/experience.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { SexType, IUpdateRequest } from 'src/app/interfaces/user.interface';
import { IResponse } from 'src/app/interfaces/core.interface';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {
  @ViewChild(NavbarComponent, { static: true }) navBar: NavbarComponent;
  @ViewChild(LoadScreemComponent, { static: true }) loadScreem: LoadScreemComponent;
  private userInfo: any = {};
  private contractsInfo: any = {
    pendings: [],
    progress: [],
    finish: []
  };
  private userName: string;
  private lastName: string;
  private email: string;
  private dni: string;
  private telf: number;
  private sex: SexType;
  private password: string;
  private age: number;
  private postalCode: number;
  private city: string;
  private region: string;
  private address: string;
  private offer: boolean;
  private bio: string;
  private codUser: string;
  constructor(
    private userService: UserService,
    private contractService: ContractService,
    private experienceService: ExperienceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private titleService: Title
  ) {
    this.userService.checkUserSession().subscribe(
      (res) => {
        const response = res as IResponse;
        if (!response.data.keepLogin) {
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        this.router.navigate(['/login']);
      }
    );
    this.codUser = this.userService.getCodUser()
  }

  ngOnInit() {
    this.titleService.setTitle('WebJobs | Panel de control');
    this.navBar.setLocation('controlPanel');
    this.getUserInfo();
  }

  private getUserInfo(): void {
    this.userService.getUser(this.userService.getCodUser()).subscribe(
      (res) => {
        const response = res as IResponse;
        const user = response.data.users;
        this.userInfo = user;
        this.setUpdateAttributes(this.userInfo);
        let s = 0;
        this.contractService.getContractsByUser(user.codUser.toString()).subscribe(
          (res1) => {
            const response1 = res1 as any;
            response1.data.contracts.forEach(contract => {
              s += contract.worker.codUser === user.codUser ? Number(contract.contractorPunctuation) : Number(contract.workerPunctuation);
            });
            if (response1.data.contracts.length > 0) {
              this.userInfo.punctuation = s / response1.data.contracts.length;
            }
            this.orderContracts(response1.data.contracts);
            this.experienceService.getExperiences(user.codUser.toString()).subscribe(
              (res2) => {
                const response2 = res2 as any;
                if (response2.data.profExp.length > 0) {
                  response2.data.profExp.sort((a: { startDate: number; }, b: { startDate: number; }) => {
                    if (a.startDate > b.startDate) { return 1; }
                    if (b.startDate > a.startDate) { return -1; }
                  });
                  this.userInfo.experiences = response2.data.profExp;
                  this.userInfo.profesion = response2.data.profExp[0].category.name;
                }
                console.log(this.userInfo);
                console.log(this.contractsInfo);
              },
              (err2) => {
                console.log(err2);
              }
            );
          },
          (err1) => {
            console.log(err1);
          }
        );
      },
      (err) => {
        console.log(err);
      });
  }

  private editExperience(codExperience: any){
    codExperience = `experience_${codExperience}`;
    console.log(codExperience);
  }

  private setUpdateAttributes(data: any) {
    this.userName = data.userName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.dni = data.dni;
    this.telf = data.telf;
    this.sex = data.sex;
    this.age = this.age;
    this.postalCode = data.postalCode;
    this.city = data.city;
    this.region = data.region;
    this.address = data.address;
    this.offer = data.offer;
    this.age = data.age;
    this.bio = data.bio;
  }

  private orderContracts(contracts: any[]) {
    contracts.forEach(contract => {
      switch (contract.status) {
        case 'PENDING':
          this.contractsInfo.pendings.push(contract);
          break;
        case 'IN_PROGRESS':
          this.contractsInfo.progress.push(contract);
          break;
        case 'FINISH':
          this.contractsInfo.finish.push(contract);
          break;
      }
    });
  }

  private updateUser(origin?: string) {
    let args: IUpdateRequest = null;
    switch (origin) {
      case 'bio':
        args = {
          codUser: this.codUser,
          newValues: {
            bio: this.bio
          }
        };
        break;
      case 'offer':
        args = {
          codUser: this.codUser,
          newValues: {
            offer: this.offer
          }
        };
        break;
      default:
        args = {
          codUser: this.codUser,
          newValues: {
            userName: this.userName,
            lastName: this.lastName,
            email: this.email,
            dni: this.dni,
            telf: this.telf,
            age: this.age,
            sex: this.sex as SexType,
            password: this.password,
            postalCode: this.postalCode,
            city: this.city,
            region: this.region,
            address: this.address,
            offer: this.offer
          }
        };
    }
    this.userService.updateUser(args).subscribe(
      (res) => {
        const response = res as IResponse;
        this.setUpdateAttributes(response.data.updatedUser);
        this.toastr.success('Datos modificados correctamente');
      },
      (err) => {
        const errorData = err.error as IResponse;
        this.toastr.error(errorData.data.error);
      }
    );
  }
}
