import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLabsComponent } from './edit-labs.component';

describe('EditLabsComponent', () => {
  let component: EditLabsComponent;
  let fixture: ComponentFixture<EditLabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
