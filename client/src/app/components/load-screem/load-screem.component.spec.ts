import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadScreemComponent } from './load-screem.component';

describe('LoadScreemComponent', () => {
  let component: LoadScreemComponent;
  let fixture: ComponentFixture<LoadScreemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadScreemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadScreemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
