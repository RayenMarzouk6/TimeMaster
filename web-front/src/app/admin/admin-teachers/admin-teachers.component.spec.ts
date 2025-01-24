import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTeachersComponent } from './admin-teachers.component';

describe('AdminTeachersComponent', () => {
  let component: AdminTeachersComponent;
  let fixture: ComponentFixture<AdminTeachersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTeachersComponent]
    });
    fixture = TestBed.createComponent(AdminTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
