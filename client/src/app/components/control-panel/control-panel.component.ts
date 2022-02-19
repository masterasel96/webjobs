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
import { AngularFireStorage } from 'angularfire2/storage';
import * as $ from 'jquery';
import { CategoryService } from 'src/app/services/category.service';
import { NotifyService } from 'src/app/services/notify.service';
import { sanitizeIdentifier } from '@angular/compiler';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {
  @ViewChild(NavbarComponent, { static: true }) navBar: NavbarComponent;
  @ViewChild(LoadScreemComponent, { static: true }) loadScreem: LoadScreemComponent;
  // GENERIC DATA
  private userInfo: any = {};
  private profCat: any = {};
  private contractsInfo: any = {
    pendings: [],
    progress: [],
    finish: []
  };
  private codUser: string;
  private contractSee: any = {};
  // EXPERIENCES DATA
  private category: string;
  private company: string;
  private position: string;
  private startDate: string;
  private endDate: string;
  // UPDATE USER DATA
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
  private photo: string;
  constructor(
    private userService: UserService,
    private contractService: ContractService,
    private experienceService: ExperienceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private titleService: Title,
    private storage: AngularFireStorage,
    private profCatService: CategoryService,
    private notifyService: NotifyService
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
    this.codUser = this.userService.getCodUser();
  }

  ngOnInit() {
    this.titleService.setTitle('WebJobs | Panel de control');
    this.navBar.setLocation('controlPanel');
    this.getUserInfo();
    this.setCategorys();
    setTimeout(() => { $('#bio textarea').height($('#photo').height() - 11); }, 1500);
    $(window).on('resize', () => {
      $('#bio textarea').height($('#photo').height() - 11);
    });
  }

  private getUserInfo(): void {
    this.userInfo = {};
    this.contractsInfo = {
      pendings: [],
      progress: [],
      finish: []
    };
    this.userService.getUser(this.userService.getCodUser()).subscribe(
      (res) => {
        const response = res as IResponse;
        const user = response.data.users;
        this.userInfo = user;
        this.setUpdateAttributes(this.userInfo);
        let s = 0;
        let total = 0;
        this.contractService.getContractsByUser(user.codUser.toString()).subscribe(
          (res1) => {
            const response1 = res1 as any;
            response1.data.contracts.forEach(contract => {
              if (contract.status === 'FINISH') {
                s += contract.worker.codUser === user.codUser ? Number(contract.contractorPunctuation) : Number(contract.workerPunctuation);
                total ++;
              }
            });
            if (response1.data.contracts.length > 0) {
              this.userInfo.punctuation = parseInt((s / total).toString());
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
    this.photo = data.photo;
    this.userInfo.photo = data.photo;
    $('#bio textarea').height($('#photo').height() - 11);
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
      case 'photo':
        args = {
          codUser: this.codUser,
          newValues: {
            photo: this.photo
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

  private changePhoto(event: MSInputMethodContext) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const files: FileList = target.files;
    const file: File = files[0];
    const metaData = {
      contentType: file.type
    };
    if (file.size > 190000) {
      this.toastr.error('El archivo es demasiado grande');
      return;
    }
    const path = `photos/${Date.now()}_user`;
    const ref = this.storage.ref(path);
    this.storage.upload(path, file, metaData).snapshotChanges().subscribe(
        async (res) => {
          this.photo = await ref.getDownloadURL().toPromise();
          this.updateUser('photo');
        },
        async (error) => {
          console.log(error);
        }
      );
  }

  private setCategorys(): void {
    this.profCatService.getCategorys().subscribe(
      (res) => {
        const response = res as IResponse;
        this.profCat = response.data.profesionalCategory;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private addExperience(): void {
    this.experienceService.setExperience({
      codUser: Number(this.codUser),
      codCategory: Number(this.category),
      company: this.company,
      position: this.position,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe(
      (res) => {
        const response = res as IResponse;
        this.category = null;
        this.company = null;
        this.position = null;
        this.startDate = null;
        this.endDate = null;
        this.getUserInfo();
        this.toastr.success('Experiencia creada correctamente');
      },
      (err) => {
        const errorData = err.error as IResponse;
        this.toastr.error(errorData.data.error);
      }
    );
  }

  private deleteExperience(codExperience: string) {
    this.experienceService.deleteExperience(codExperience).subscribe(
      (res) => {
        const response = res as IResponse;
        this.getUserInfo();
        this.toastr.success('Experiencia borrada correctamente');
      },
      (err) => {
        const errorData = err.error as IResponse;
        this.toastr.error(errorData.data.error);
      }
    );
  }

  private cancelContract(codContract: string) {
    this.contractService.updateContract(
      {
        codContract,
        newValues: {
          status: 'CANCELLED'
        }
      }
    ).subscribe(
      (res) => {
        const response = res as IResponse;
        const codUserToSend: string = response.data.updateContract.contractor.codUser === this.codUser ?
          response.data.updateContract.worker.codUser :
          response.data.updateContract.contractor.codUser;
        this.notifyService.setNotify({
          codUser: codUserToSend.toString(),
          codIndirectUser: this.userService.getCodUser(),
          message: `CANCEL_WORK:::${codContract}`
        }).subscribe(
          (res1) => {
            this.toastr.success('Peticion cancelada correctamente');
            this.getUserInfo();
          },
          (err1) => {
            console.log(err1);
            this.toastr.error('Ha ocurrido un error cancelando tu peticion');
          }
        );
      },
      (err) => {
        const errorData = err.error as IResponse;
        this.toastr.error(errorData.data.error);
      }
    );
  }

  private acceptContract(codContract: string) {
    this.contractService.updateContract(
      {
        codContract,
        newValues: {
          status: 'IN_PROGRESS',
          startDate: new Date().toUTCString()
        }
      }
    ).subscribe(
      (res) => {
        const response = res as IResponse;
        const codUserToSend: string = response.data.updateContract.contractor.codUser === this.codUser ?
          response.data.updateContract.worker.codUser :
          response.data.updateContract.contractor.codUser;
        this.notifyService.setNotify({
          codUser: codUserToSend.toString(),
          codIndirectUser: this.userService.getCodUser(),
          message: `ACCEPT_WORK:::${codContract}`
        }).subscribe(
          (res1) => {
            this.toastr.success('Peticion aceptada correctamente');
            this.getUserInfo();
          },
          (err1) => {
            console.log(err1);
            this.toastr.error('Ha ocurrido un error aceptando tu peticion');
          }
        );
      },
      (err) => {
        const errorData = err.error as IResponse;
        this.toastr.error(errorData.data.error);
      }
    );
  }

  private finishContract(codContract: string) {
    this.contractService.updateContract(
      {
        codContract,
        newValues: {
          status: 'FINISH',
          endDate: new Date().toUTCString()
        }
      }
    ).subscribe(
      (res) => {
        const response = res as IResponse;
        const codUserToSend: string = response.data.updateContract.contractor.codUser.toString() ===
          this.userService.getCodUser().toString() ?
          response.data.updateContract.worker.codUser :
          response.data.updateContract.contractor.codUser;
        this.notifyService.setNotify({
          codUser: codUserToSend.toString(),
          codIndirectUser: this.userService.getCodUser(),
          message: `FINISH_WORK:::${codContract}`
        }).subscribe(
          (res1) => {
            this.toastr.success('Contrato finalizado corrrectamente');
          },
          (err1) => {
            console.log(err1);
            this.toastr.error('Ha ocurrido un error aceptando tu peticion');
          }
        );
        this.notifyService.setNotify({
          codUser: this.userService.getCodUser(),
          codIndirectUser: codUserToSend.toString(),
          message: `FINISH_WORK:::${codContract}`
        }).subscribe(
          (res1) => {
            this.toastr.success('Ya puedes dejar tu puntuacion, te habra llegado una notificacion :)');
            this.navBar.checkForNotifys();
            this.getUserInfo();
          },
          (err1) => {
            console.log(err1);
            this.toastr.error('Ha ocurrido un error aceptando tu peticion');
          }
        );
      },
      (err) => {
        const errorData = err.error as IResponse;
        this.toastr.error(errorData.data.error);
      }
    );
  }

  private seeComentsContract(codContract: string) {
    this.contractSee = null;
    this.contractService.getContract(codContract).subscribe(
      (res) => {
        const response = res as IResponse;
        this.contractSee = response.data.contracts;
      },
      (err) => {
        const errorData = err.error as IResponse;
        this.toastr.error(errorData.data.error);
      }
    );
  }
}
