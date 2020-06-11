import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifysComponent } from './notifys.component';

describe('NotifysComponent', () => {
  let component: NotifysComponent;
  let fixture: ComponentFixture<NotifysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
