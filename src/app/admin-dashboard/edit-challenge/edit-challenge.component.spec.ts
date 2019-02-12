import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChallengeComponent } from './edit-challenge.component';

describe('EditChallengeComponent', () => {
  let component: EditChallengeComponent;
  let fixture: ComponentFixture<EditChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
