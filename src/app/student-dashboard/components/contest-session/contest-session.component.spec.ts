import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestSessionComponent } from './contest-session.component';

describe('ContestSessionComponent', () => {
  let component: ContestSessionComponent;
  let fixture: ComponentFixture<ContestSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
