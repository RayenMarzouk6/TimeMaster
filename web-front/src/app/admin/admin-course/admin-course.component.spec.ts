import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCourseComponent } from './admin-course.component';

describe('AdminCourseComponent', () => {
  let component: AdminCourseComponent;
  let fixture: ComponentFixture<AdminCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCourseComponent]
    });
    fixture = TestBed.createComponent(AdminCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
