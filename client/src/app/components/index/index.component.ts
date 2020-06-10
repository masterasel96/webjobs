import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadScreemComponent } from '../load-screem/load-screem.component';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';
import { ContractService } from 'src/app/services/contract.service';
import { ExperienceService } from 'src/app/services/experience.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IResponse } from 'src/app/interfaces/core.interface';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild(NavbarComponent, { static: true }) navBar: NavbarComponent;
  @ViewChild(LoadScreemComponent, { static: true }) loadScreem: LoadScreemComponent;
  private profCat: string[] = [];
  private workers: any[] = [];
  private searchMsg = 'Te dejamos por aquí algunos empleados cerca de tí';
  constructor(
    private profCatService: CategoryService,
    private userService: UserService,
    private contractService: ContractService,
    private experienceService: ExperienceService,
    private toastr: ToastrService,
    private titleService: Title,
    private router: Router
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
   }

  async ngOnInit() {
    this.titleService.setTitle('WebJobs | Inicio');
    this.navBar.setLocation('index');
    this.setCategorys();
    this.getInitialWorkers();
  }

  private setCategorys(): void {
    this.profCatService.getCategorys().subscribe(
      (res) => {
        const response = res as IResponse;
        response.data.profesionalCategory.forEach(cat => {
          this.profCat.push(cat.name);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private getInitialWorkers() {
    this.userService.getUser(this.userService.getCodUser()).subscribe(
      (res) => {
        const response = res as IResponse;
        this.userService.getUsersByCatLoc({
          category: null,
          location: response.data.users.region,
          noUser: this.userService.getCodUser()
        }).subscribe(
          (res1) => {
            const response1 = res1 as any;
            this.processUsersInfo(response1);
          },
          (err1) => {
            console.log(err1);
          });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private searchWorkers(city: string, profesion: string): void {
    if (city === '' || profesion === 'Profesion...') {
      this.toastr.error('Completa los campos de busqueda');
      return;
    }
    this.searchMsg = 'Te dejamos por aquí los resultados de tu busqueda';
    this.workers = [];
    this.userService.getUsersByCatLoc({
      category: profesion,
      location: city,
      noUser: this.userService.getCodUser()
    }).subscribe(
      (res) => {
        const response = res as IResponse;
        this.processUsersInfo(response);
      },
      (err) => {
        console.log(err);
      });
  }

  private processUsersInfo(response: any): void {
    response.data.users.forEach(user => {
      let s = 0;
      this.contractService.getContractsByUser(user.codUser.toString()).subscribe(
        (res1) => {
          const response1 = res1 as any;
          response1.data.contracts.forEach(contract => {
            s += contract.worker.codUser === user.codUser ? Number(contract.contractorPunctuation) : Number(contract.workerPunctuation);
          });
          user.punctuation = s / response1.data.contracts.length;
          this.experienceService.getExperiences(user.codUser.toString()).subscribe(
            (res2) => {
              const response2 = res2 as any;
              if (response2.data.profExp.length > 0) {
                response2.data.profExp.sort((a: { startDate: number; }, b: { startDate: number; }) => {
                  if (a.startDate > b.startDate) { return 1; }
                  if (b.startDate > a.startDate) { return -1; }
                });
                user.profesion = response2.data.profExp[0].category.name;
              }
              this.workers.push(user);
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
    });
  }

}
